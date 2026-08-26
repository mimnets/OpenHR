// One generate() call across four providers.
//
// Three of them (OpenRouter, DeepSeek, OpenAI) speak the OpenAI chat-completions
// shape, so they share a code path and differ only in base URL, key and default
// model. Anthropic has its own request and response shape and gets its own
// branch. Adding a provider means adding a row here, not touching callers.
//
// Keys live in Edge Function secrets. Never accept a key from the request body:
// this is called from a super-admin-authenticated function, but a key arriving
// over the wire is a key in a log somewhere.

export type LlmProvider = 'openrouter' | 'deepseek' | 'openai' | 'anthropic';

export interface LlmRequest {
  provider: LlmProvider;
  model: string;
  system: string;
  user: string;
  maxTokens?: number;
  temperature?: number;
}

export interface LlmResult {
  ok: boolean;
  text?: string;
  /** Operator-facing. Safe to log, not to show a customer verbatim. */
  error?: string;
  /** The upstream HTTP status, when the provider answered with one. */
  status?: number;
  /**
   * True when the failure is transient — a rate limit, an upstream 5xx or a
   * timeout. Callers use this to pick an honest status code instead of
   * pattern-matching the error string.
   */
  retryable?: boolean;
}

const TIMEOUT_MS = 45_000;

interface ProviderConfig {
  envKey: string;
  baseUrl: string;
  /** OpenRouter asks callers to identify themselves; harmless elsewhere. */
  extraHeaders?: Record<string, string>;
}

const OPENAI_COMPATIBLE: Record<string, ProviderConfig> = {
  openrouter: {
    envKey: 'OPENROUTER_API_KEY',
    baseUrl: 'https://openrouter.ai/api/v1/chat/completions',
    extraHeaders: {
      'HTTP-Referer': 'https://openhrapp.com',
      'X-Title': 'OpenHRApp',
    },
  },
  deepseek: {
    envKey: 'DEEPSEEK_API_KEY',
    baseUrl: 'https://api.deepseek.com/chat/completions',
  },
  openai: {
    envKey: 'OPENAI_API_KEY',
    baseUrl: 'https://api.openai.com/v1/chat/completions',
  },
};

/** Which providers currently have a key configured. Drives the dashboard picker. */
export function availableProviders(): LlmProvider[] {
  const out: LlmProvider[] = [];
  for (const [name, cfg] of Object.entries(OPENAI_COMPATIBLE)) {
    if (Deno.env.get(cfg.envKey)) out.push(name as LlmProvider);
  }
  if (Deno.env.get('ANTHROPIC_API_KEY')) out.push('anthropic');
  return out;
}

export async function generate(req: LlmRequest): Promise<LlmResult> {
  const { provider, model, system, user } = req;
  const maxTokens = req.maxTokens ?? 900;
  const temperature = req.temperature ?? 0.7;

  try {
    if (provider === 'anthropic') {
      const key = Deno.env.get('ANTHROPIC_API_KEY');
      if (!key) return { ok: false, error: 'ANTHROPIC_API_KEY is not configured' };

      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': key,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model,
          max_tokens: maxTokens,
          temperature,
          system,
          messages: [{ role: 'user', content: user }],
        }),
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });

      if (!res.ok) {
        return {
          ok: false,
          error: `anthropic ${res.status}: ${(await res.text()).slice(0, 300)}`,
          status: res.status,
          retryable: res.status === 429 || res.status >= 500,
        };
      }
      const data = await res.json();
      const text = (data?.content ?? [])
        .filter((b: { type: string }) => b.type === 'text')
        .map((b: { text: string }) => b.text)
        .join('')
        .trim();
      return text ? { ok: true, text } : { ok: false, error: 'anthropic returned no text' };
    }

    const cfg = OPENAI_COMPATIBLE[provider];
    if (!cfg) return { ok: false, error: `Unknown provider: ${provider}` };

    const key = Deno.env.get(cfg.envKey);
    if (!key) return { ok: false, error: `${cfg.envKey} is not configured` };

    const res = await fetch(cfg.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`,
        ...(cfg.extraHeaders ?? {}),
      },
      body: JSON.stringify({
        model,
        max_tokens: maxTokens,
        temperature,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user },
        ],
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    if (!res.ok) {
      const body = (await res.text()).slice(0, 300);
      // OpenRouter's free tier queues and rate-limits; surface that distinctly
      // so the caller can fall back rather than treating it as a hard failure.
      if (res.status === 429) {
        return {
          ok: false,
          error: `${provider} rate-limited (429). Free models queue under load. ${body}`,
          status: 429,
          retryable: true,
        };
      }
      return {
        ok: false,
        error: `${provider} ${res.status}: ${body}`,
        status: res.status,
        retryable: res.status >= 500,
      };
    }

    const data = await res.json();
    const text: string = data?.choices?.[0]?.message?.content?.trim() ?? '';
    return text ? { ok: true, text } : { ok: false, error: `${provider} returned no text` };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    // Aborts and network faults are transient by nature.
    return { ok: false, error: `${provider} request failed: ${msg}`, retryable: true };
  }
}

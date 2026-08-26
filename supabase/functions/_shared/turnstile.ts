// Cloudflare Turnstile server-side verification.
//
// The widget token is worthless until the server exchanges it with Cloudflare —
// a bot can post any string it likes as `turnstileToken`. Every unauthenticated
// endpoint that accepts writes must call verifyTurnstile() before doing work.
//
// Follows Cloudflare's documented contract: verify success, pin the `action` to
// the surface that issued it, and pin the `hostname` to a domain we own. The
// last two matter because a token minted by a widget on some other page — or on
// an attacker's own site using a stolen sitekey — still returns success:true.
// Without those checks the token is a bearer credential anyone can farm.

const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
const VERIFY_TIMEOUT_MS = 10_000;
const MAX_TOKEN_LENGTH = 2048;

/** Hostnames the widget legitimately renders on. Override with TURNSTILE_ALLOWED_HOSTNAMES. */
const DEFAULT_HOSTNAMES = ['openhrapp.com', 'www.openhrapp.com'];

export interface TurnstileResult {
  ok: boolean;
  /** Safe to surface to the client. Never leaks Cloudflare's raw error codes. */
  message?: string;
}

function allowedHostnames(): Set<string> {
  const raw = Deno.env.get('TURNSTILE_ALLOWED_HOSTNAMES');
  const list = raw
    ? raw.split(',').map(h => h.trim().toLowerCase()).filter(Boolean)
    : DEFAULT_HOSTNAMES;
  return new Set(list);
}

/**
 * Verifies a Turnstile token.
 *
 * If TURNSTILE_SECRET_KEY is not configured the check is skipped and a warning
 * is logged — this keeps local development and self-hosted deployments working.
 * Set the secret in production and the endpoint becomes closed by default.
 *
 * @param token         the `turnstileToken` supplied by the client
 * @param remoteIp      caller IP from the CF-Connecting-IP / X-Forwarded-For header
 * @param expectedAction the `action` the widget was rendered with
 */
export async function verifyTurnstile(
  token: string | null | undefined,
  remoteIp?: string | null,
  expectedAction = 'register',
): Promise<TurnstileResult> {
  const secret = Deno.env.get('TURNSTILE_SECRET_KEY');

  if (!secret) {
    console.warn('[turnstile] TURNSTILE_SECRET_KEY not set — verification skipped');
    return { ok: true };
  }

  // Cheap structural rejects before spending a network call on obvious junk.
  if (typeof token !== 'string' || token.length === 0) {
    return { ok: false, message: 'Please complete the anti-spam check.' };
  }
  if (token.length > MAX_TOKEN_LENGTH) {
    console.warn(`[turnstile] oversized token rejected (${token.length} chars)`);
    return { ok: false, message: 'Anti-spam check failed. Please try again.' };
  }

  const body = new URLSearchParams({ secret, response: token });
  if (remoteIp) body.set('remoteip', remoteIp);

  let data: { success: boolean; action?: string; hostname?: string; 'error-codes'?: string[] };
  try {
    const res = await fetch(VERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
      signal: AbortSignal.timeout(VERIFY_TIMEOUT_MS),
    });
    if (!res.ok) throw new Error(`siteverify ${res.status}`);
    data = await res.json();
  } catch (e) {
    // Cloudflare unreachable or slow. Fail closed: an outage must not become an
    // open door on the endpoint that spam is actively targeting.
    console.error('[turnstile] siteverify failed:', e instanceof Error ? e.message : e);
    return { ok: false, message: 'Anti-spam check unavailable. Please try again shortly.' };
  }

  if (!data.success) {
    // Logged for operators, not returned — error codes tell an attacker which
    // half of the check they failed. `invalid-input-response` also covers a
    // token that was already spent, which is the normal retry case.
    console.warn('[turnstile] rejected:', data['error-codes']?.join(',') ?? 'unknown');
    return { ok: false, message: 'Anti-spam check failed. Please try again.' };
  }

  if (data.action !== expectedAction) {
    console.warn(`[turnstile] action mismatch: got "${data.action}", expected "${expectedAction}"`);
    return { ok: false, message: 'Anti-spam check failed. Please try again.' };
  }

  const allowed = allowedHostnames();
  if (!data.hostname || !allowed.has(data.hostname.toLowerCase())) {
    console.warn(`[turnstile] hostname "${data.hostname}" not in allowlist`);
    return { ok: false, message: 'Anti-spam check failed. Please try again.' };
  }

  return { ok: true };
}

/** Best-effort caller IP from the proxy headers Supabase forwards. */
export function callerIp(req: Request): string | null {
  return req.headers.get('cf-connecting-ip')
    ?? req.headers.get('x-forwarded-for')?.split(',')[0].trim()
    ?? null;
}

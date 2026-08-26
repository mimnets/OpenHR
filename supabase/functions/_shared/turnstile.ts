// Cloudflare Turnstile server-side verification.
//
// The widget token is worthless until the server exchanges it with Cloudflare —
// a bot can post any string it likes as `turnstileToken`. Every unauthenticated
// endpoint that accepts writes must call verifyTurnstile() before doing work.

const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

export interface TurnstileResult {
  ok: boolean;
  /** Safe to surface to the client. Never leaks Cloudflare's raw error codes. */
  message?: string;
}

/**
 * Verifies a Turnstile token.
 *
 * If TURNSTILE_SECRET_KEY is not configured the check is skipped and a warning
 * is logged — this keeps local development and self-hosted deployments working.
 * Set the secret in production and the endpoint becomes closed by default.
 *
 * @param token  the `turnstileToken` supplied by the client
 * @param remoteIp caller IP from the CF-Connecting-IP / X-Forwarded-For header
 */
export async function verifyTurnstile(
  token: string | null | undefined,
  remoteIp?: string | null,
): Promise<TurnstileResult> {
  const secret = Deno.env.get('TURNSTILE_SECRET_KEY');

  if (!secret) {
    console.warn('[turnstile] TURNSTILE_SECRET_KEY not set — verification skipped');
    return { ok: true };
  }

  if (!token) {
    return { ok: false, message: 'Please complete the anti-spam check.' };
  }

  const body = new FormData();
  body.append('secret', secret);
  body.append('response', token);
  if (remoteIp) body.append('remoteip', remoteIp);

  let res: Response;
  try {
    res = await fetch(VERIFY_URL, { method: 'POST', body });
  } catch (e) {
    // Cloudflare unreachable. Fail closed: an outage must not become an open
    // door on the endpoint that spam is actively targeting.
    console.error('[turnstile] siteverify unreachable:', e);
    return { ok: false, message: 'Anti-spam check unavailable. Please try again shortly.' };
  }

  if (!res.ok) {
    console.error(`[turnstile] siteverify HTTP ${res.status}`);
    return { ok: false, message: 'Anti-spam check unavailable. Please try again shortly.' };
  }

  const data = await res.json() as { success: boolean; 'error-codes'?: string[] };

  if (!data.success) {
    // Logged for operators, not returned — error codes tell an attacker which
    // half of the check they failed.
    console.warn('[turnstile] rejected:', data['error-codes']?.join(',') ?? 'unknown');
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

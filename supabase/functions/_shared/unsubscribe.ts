// Signed unsubscribe tokens.
//
// The token carries the address and an HMAC over it, so the link verifies
// without storing anything and cannot be edited to unsubscribe someone else.
// Signed with CRON_SECRET, which already exists and never leaves the server.
//
// One-click unsubscribe is not decoration on lifecycle mail. Without it,
// recipients use the "report spam" button instead, and complaints damage the
// sending domain far more than an unsubscribe does.

const enc = new TextEncoder();

function b64urlEncode(s: string): string {
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function b64urlDecode(s: string): string {
  const pad = s.replace(/-/g, '+').replace(/_/g, '/');
  return atob(pad + '='.repeat((4 - (pad.length % 4)) % 4));
}

async function hmacHex(message: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(message));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/** Returns `<b64url(email)>.<hmac>`. */
export async function signUnsubscribe(email: string, secret: string): Promise<string> {
  const addr = email.trim().toLowerCase();
  return `${b64urlEncode(addr)}.${await hmacHex(addr, secret)}`;
}

/** Returns the address if the signature checks out, otherwise null. */
export async function verifyUnsubscribe(token: string, secret: string): Promise<string | null> {
  const [payload, sig] = (token ?? '').split('.');
  if (!payload || !sig) return null;

  let addr: string;
  try {
    addr = b64urlDecode(payload);
  } catch {
    return null;
  }

  const expected = await hmacHex(addr, secret);

  // Constant-time compare. The timing signal here is small, but comparing MACs
  // with === is the kind of thing that is free to do properly.
  if (expected.length !== sig.length) return null;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ sig.charCodeAt(i);
  return diff === 0 ? addr : null;
}

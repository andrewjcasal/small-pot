/**
 * Stateless unsubscribe tokens, all Web Crypto (`crypto.subtle`), no database lookup
 * needed to verify one.
 *
 *   token = base64url(email) + "." + hex(HMAC-SHA256(NEWSLETTER_SECRET, email)).slice(0, 32)
 *
 * `generateUnsubscribeToken` and `verifyUnsubscribeToken` are inverses of each other;
 * verification recomputes the HMAC from the embedded email and does a constant-time
 * compare against the signature half of the token.
 */

const encoder = new TextEncoder();
const decoder = new TextDecoder();

function base64UrlEncode(bytes: Uint8Array): string {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlDecode(input: string): Uint8Array {
  const padded = input.replace(/-/g, '+').replace(/_/g, '/');
  const withPadding = padded + '='.repeat((4 - (padded.length % 4)) % 4);
  const binary = atob(withPadding);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function bytesToHex(bytes: ArrayBuffer): string {
  return Array.from(new Uint8Array(bytes))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

async function hmacHex(secret: string, message: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(message));
  return bytesToHex(signature);
}

/** Constant-time string compare (byte length included), so mismatched lengths don't short-circuit. */
export function timingSafeEqualStr(a: string, b: string): boolean {
  const aBytes = encoder.encode(a);
  const bBytes = encoder.encode(b);
  const len = Math.max(aBytes.length, bBytes.length, 1);
  let diff = aBytes.length === bBytes.length ? 0 : 1;
  for (let i = 0; i < len; i++) {
    const x = i < aBytes.length ? aBytes[i] : 0;
    const y = i < bBytes.length ? bBytes[i] : 0;
    diff |= x ^ y;
  }
  return diff === 0;
}

function requireSecret(): string {
  const secret = process.env.NEWSLETTER_SECRET;
  if (!secret) throw new Error('NEWSLETTER_SECRET is not set');
  return secret;
}

export async function generateUnsubscribeToken(email: string): Promise<string> {
  const normalized = email.trim().toLowerCase();
  const emailPart = base64UrlEncode(encoder.encode(normalized));
  const sigPart = (await hmacHex(requireSecret(), normalized)).slice(0, 32);
  return `${emailPart}.${sigPart}`;
}

/** Returns the normalized email if the token is well-formed and its signature checks out, else null. */
export async function verifyUnsubscribeToken(token: string): Promise<string | null> {
  const dot = token.indexOf('.');
  if (dot <= 0 || dot === token.length - 1) return null;
  const emailPart = token.slice(0, dot);
  const sigPart = token.slice(dot + 1);

  let email: string;
  try {
    email = decoder.decode(base64UrlDecode(emailPart)).trim().toLowerCase();
  } catch {
    return null;
  }
  if (!email) return null;

  const expected = (await hmacHex(requireSecret(), email)).slice(0, 32);
  if (!timingSafeEqualStr(expected, sigPart)) return null;
  return email;
}

import { sessionSecret, siteOrigin } from "./env.server";

/**
 * Sealed cookies for the customer session.
 *
 * Shopify's customer access token is what proves a shopper is signed in, so it
 * never goes anywhere a script can read it: no `localStorage`, no
 * `sessionStorage`, no response body. It lives in an `HttpOnly` cookie, AES-GCM
 * encrypted with a key derived from `SESSION_SECRET`, so the cookie is opaque
 * and tamper-evident even to whoever holds it.
 *
 * Written against WebCrypto rather than `node:crypto` on purpose — the nitro
 * build targets a worker runtime, and the same code has to survive the move to
 * Next.js. Nothing here imports the framework; callers hand in a cookie header
 * and get back a `Set-Cookie` string.
 */

export const SESSION_COOKIE = "vr_customer";
export const OAUTH_COOKIE = "vr_oauth";

/** Roughly the refresh-token window; a shopper stays signed in this long. */
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30;
/** A sign-in round trip that takes longer than this has been abandoned. */
const OAUTH_TTL_SECONDS = 60 * 10;

export type CustomerSession = {
  accessToken: string;
  refreshToken: string;
  idToken: string | null;
  /** Epoch ms after which `accessToken` must be refreshed before use. */
  expiresAt: number;
};

export type OAuthTransaction = {
  codeVerifier: string;
  state: string;
  nonce: string;
  /** Site-relative path to land on after sign-in. Never an absolute URL. */
  returnTo: string;
};

/* ------------------------------- sealing -------------------------------- */

type Envelope<T> = { d: T; exp: number };

const encoder = new TextEncoder();
const decoder = new TextDecoder();

let keyPromise: Promise<CryptoKey> | null = null;

async function deriveKey(): Promise<CryptoKey> {
  const material = await crypto.subtle.importKey(
    "raw",
    encoder.encode(sessionSecret()),
    "HKDF",
    false,
    ["deriveKey"],
  );
  return crypto.subtle.deriveKey(
    {
      name: "HKDF",
      hash: "SHA-256",
      salt: new Uint8Array(0),
      info: encoder.encode("vr-customer-session-v1"),
    },
    material,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}

function key(): Promise<CryptoKey> {
  // Cached across requests, but a failure must not be cached — a missing
  // SESSION_SECRET should keep throwing its actionable error, not a stale
  // rejection from the first request that hit it.
  keyPromise ??= deriveKey().catch((error: unknown) => {
    keyPromise = null;
    throw error;
  });
  return keyPromise;
}

function base64url(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i] as number);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function unBase64url(text: string): Uint8Array<ArrayBuffer> {
  const binary = atob(text.replace(/-/g, "+").replace(/_/g, "/"));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function seal<T>(data: T, ttlSeconds: number): Promise<string> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const envelope: Envelope<T> = { d: data, exp: Date.now() + ttlSeconds * 1000 };
  const sealed = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    await key(),
    encoder.encode(JSON.stringify(envelope)),
  );
  return `v1.${base64url(iv)}.${base64url(new Uint8Array(sealed))}`;
}

/**
 * `null` for anything that is not a live, intact seal — wrong key, edited
 * bytes, expired envelope, or simply absent. Callers treat all of those the
 * same way: not signed in.
 */
async function unseal<T>(value: string | undefined): Promise<T | null> {
  if (!value) return null;
  const [version, iv, body] = value.split(".");
  if (version !== "v1" || !iv || !body) return null;
  try {
    const plain = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: unBase64url(iv) },
      await key(),
      unBase64url(body),
    );
    const envelope = JSON.parse(decoder.decode(plain)) as Envelope<T>;
    // The `exp` inside the seal is the real deadline. Max-Age on the cookie is
    // only a hint to the browser and is trivially stripped by whoever holds it.
    if (typeof envelope.exp !== "number" || envelope.exp <= Date.now()) return null;
    return envelope.d;
  } catch {
    return null;
  }
}

/* ------------------------------- cookies -------------------------------- */

function serialize(name: string, value: string, maxAge: number): string {
  const parts = [
    `${name}=${value}`,
    "Path=/",
    "HttpOnly",
    // Lax, not Strict: the OAuth callback is a top-level GET arriving from
    // shopify.com, and Strict would withhold the cookie that proves it is ours.
    "SameSite=Lax",
    `Max-Age=${maxAge}`,
  ];
  // Browsers reject `Secure` cookies on plain-http origins, which would break
  // local development entirely.
  if (siteOrigin().startsWith("https://")) parts.push("Secure");
  return parts.join("; ");
}

export function parseCookies(header: string | null): Record<string, string> {
  const jar: Record<string, string> = {};
  if (!header) return jar;
  for (const pair of header.split(";")) {
    const index = pair.indexOf("=");
    if (index < 1) continue;
    jar[pair.slice(0, index).trim()] = pair.slice(index + 1).trim();
  }
  return jar;
}

export function sessionCookie(session: CustomerSession): Promise<string> {
  return seal(session, SESSION_TTL_SECONDS).then((value) =>
    serialize(SESSION_COOKIE, value, SESSION_TTL_SECONDS),
  );
}

export function oauthCookie(transaction: OAuthTransaction): Promise<string> {
  return seal(transaction, OAUTH_TTL_SECONDS).then((value) =>
    serialize(OAUTH_COOKIE, value, OAUTH_TTL_SECONDS),
  );
}

export function clearedCookie(name: string): string {
  return serialize(name, "", 0);
}

export function readSession(cookieHeader: string | null): Promise<CustomerSession | null> {
  return unseal<CustomerSession>(parseCookies(cookieHeader)[SESSION_COOKIE]);
}

export function readOAuthTransaction(
  cookieHeader: string | null,
): Promise<OAuthTransaction | null> {
  return unseal<OAuthTransaction>(parseCookies(cookieHeader)[OAUTH_COOKIE]);
}

/** Reads a session out of an already-extracted cookie value (server functions). */
export function openSession(sealed: string | undefined): Promise<CustomerSession | null> {
  return unseal<CustomerSession>(sealed);
}

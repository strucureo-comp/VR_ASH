import { customerAccountConfig, type CustomerAccountConfig } from "./env.server";

/**
 * Shopify Customer Account API — OIDC sign-in and the authenticated customer
 * GraphQL endpoint.
 *
 * Shopify hosts the entire sign-in screen (email, then a one-time code), so
 * there is no password to store, no signup form, and no user table here. This
 * file does the authorization-code + PKCE dance and nothing else.
 *
 * Two client types are supported, chosen by whether a client secret is set:
 *
 * - **Confidential** (secret set) — HTTP Basic on the token endpoint. This is
 *   Shopify's documented choice when the exchange runs on a server and the
 *   refresh token is held server-side, which is exactly what happens here.
 * - **Public** (no secret) — PKCE alone, plus an `Origin` header that Shopify
 *   validates against the "Javascript origin(s)" allowlist in the Headless
 *   channel settings. Sending it from a server is undocumented but is the only
 *   way a public client can exchange a code outside the browser.
 *
 * No framework imports: callers pass values in and get plain data back.
 */

/** Shopify returns 403 to server-side requests that arrive without one. */
const USER_AGENT = "Vallalaar Remedies Storefront";

/** Documented scope string. The granular `customer_*` permissions are NOT
 * scope values — they are checkboxes in the Headless channel settings. */
const SCOPES = "openid email customer-account-api:full";

export class CustomerAuthError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "CustomerAuthError";
  }
}

function config(): CustomerAccountConfig {
  const value = customerAccountConfig();
  if (!value) {
    throw new CustomerAuthError(
      "Customer accounts are not configured. Set SHOPIFY_SHOP_ID and SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID from Admin → Sales channels → Headless → Customer Account API.",
      503,
    );
  }
  return value;
}

/** `true` when sign-in can be offered at all. Used to hide the UI otherwise. */
export function customerAccountsEnabled(): boolean {
  return customerAccountConfig() !== null;
}

/* --------------------------------- PKCE ---------------------------------- */

function base64url(bytes: ArrayBuffer | Uint8Array): string {
  const view = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let binary = "";
  for (let i = 0; i < view.length; i++) binary += String.fromCharCode(view[i] as number);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/** 32 random bytes, base64url — 43 characters, inside PKCE's 43–128 range. */
export function randomString(): string {
  return base64url(crypto.getRandomValues(new Uint8Array(32)));
}

export async function codeChallenge(verifier: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier));
  return base64url(digest);
}

/* ------------------------------ authorize -------------------------------- */

export type AuthorizeParams = {
  redirectUri: string;
  state: string;
  nonce: string;
  codeChallenge: string;
};

export function authorizeUrl(params: AuthorizeParams): string {
  const { issuer, clientId } = config();
  const url = new URL(`${issuer}/oauth/authorize`);
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("redirect_uri", params.redirectUri);
  url.searchParams.set("scope", SCOPES);
  url.searchParams.set("state", params.state);
  url.searchParams.set("nonce", params.nonce);
  url.searchParams.set("code_challenge", params.codeChallenge);
  url.searchParams.set("code_challenge_method", "S256");
  return url.toString();
}

/* -------------------------------- tokens --------------------------------- */

export type TokenSet = {
  accessToken: string;
  refreshToken: string;
  idToken: string | null;
  /** Epoch ms, derived from the response's `expires_in`. */
  expiresAt: number;
};

type RawTokenResponse = {
  access_token?: string;
  refresh_token?: string;
  id_token?: string;
  expires_in?: number;
  error?: string;
  error_description?: string;
};

async function requestTokens(body: URLSearchParams, origin: string): Promise<TokenSet> {
  const { issuer, clientId, clientSecret } = config();
  body.set("client_id", clientId);

  const headers: Record<string, string> = {
    "content-type": "application/x-www-form-urlencoded",
    accept: "application/json",
    "user-agent": USER_AGENT,
  };
  if (clientSecret) {
    headers["authorization"] = `Basic ${btoa(`${clientId}:${clientSecret}`)}`;
  } else {
    // Public clients only: Shopify answers 401 `invalid_token` when this is
    // missing, and the value must be in the channel's Javascript origins list.
    headers["origin"] = origin;
  }

  const response = await fetch(`${issuer}/oauth/token`, { method: "POST", headers, body });
  const text = await response.text();
  let payload: RawTokenResponse = {};
  try {
    payload = JSON.parse(text) as RawTokenResponse;
  } catch {
    /* Shopify occasionally answers HTML on infrastructure errors. */
  }

  if (!response.ok || !payload.access_token || !payload.refresh_token) {
    const detail = payload.error_description ?? payload.error ?? text.slice(0, 200);
    throw new CustomerAuthError(
      `Shopify token request failed (${response.status}): ${detail}`,
      response.status === 0 ? 502 : response.status,
    );
  }

  return {
    accessToken: payload.access_token,
    refreshToken: payload.refresh_token,
    idToken: payload.id_token ?? null,
    // `expires_in` is not documented as a fixed value, so it is always read
    // from the response. 60s of headroom keeps a request from racing expiry.
    expiresAt: Date.now() + Math.max(0, (payload.expires_in ?? 7200) - 60) * 1000,
  };
}

export function exchangeCode(opts: {
  code: string;
  codeVerifier: string;
  redirectUri: string;
  origin: string;
}): Promise<TokenSet> {
  return requestTokens(
    new URLSearchParams({
      grant_type: "authorization_code",
      code: opts.code,
      redirect_uri: opts.redirectUri,
      code_verifier: opts.codeVerifier,
    }),
    opts.origin,
  );
}

export function refreshTokens(refreshToken: string, origin: string): Promise<TokenSet> {
  // No `code_verifier` on refresh. Whatever refresh token comes back replaces
  // the old one — Shopify's docs do not say the previous one stays valid.
  return requestTokens(
    new URLSearchParams({ grant_type: "refresh_token", refresh_token: refreshToken }),
    origin,
  );
}

/* ------------------------------- id token -------------------------------- */

export type IdTokenClaims = {
  nonce?: string;
  sub?: string;
  email?: string;
};

/**
 * Reads the id token's claims **without** verifying its signature, which is
 * sound only because of where it came from: a direct server-to-server POST to
 * Shopify's token endpoint over TLS. It never passed through the browser, so
 * there is no untrusted hop whose tampering a signature check would catch.
 * Returns `null` for anything unparseable rather than throwing.
 */
export function decodeIdTokenClaims(idToken: string | null): IdTokenClaims | null {
  if (!idToken) return null;
  const segment = idToken.split(".")[1];
  if (!segment) return null;
  try {
    const binary = atob(segment.replace(/-/g, "+").replace(/_/g, "/"));
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return JSON.parse(new TextDecoder().decode(bytes)) as IdTokenClaims;
  } catch {
    return null;
  }
}

/* -------------------------------- logout --------------------------------- */
/**
 * Ends the Shopify-side session too, not just our cookie. `id_token_hint` is
 * required, which is why the id token is kept in the session at all.
 */
export function logoutUrl(idToken: string | null, postLogoutRedirectUri: string): string {
  const { issuer } = config();
  const url = new URL(`${issuer}/logout`);
  if (idToken) url.searchParams.set("id_token_hint", idToken);
  url.searchParams.set("post_logout_redirect_uri", postLogoutRedirectUri);
  return url.toString();
}

/* -------------------------------- GraphQL -------------------------------- */

type GraphQLResponse<T> = {
  data?: T | null;
  errors?: Array<{ message: string; extensions?: { code?: string } }>;
};

/**
 * Authenticated customer GraphQL. The `Authorization` header carries the bare
 * access token — Shopify's Customer Account API does **not** use the `Bearer`
 * prefix, and adding it produces a 401.
 */
export async function customerFetch<T>(
  query: string,
  variables: Record<string, unknown>,
  accessToken: string,
): Promise<T> {
  const { apiEndpoint } = config();
  const response = await fetch(apiEndpoint, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      accept: "application/json",
      authorization: accessToken,
      "user-agent": USER_AGENT,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (response.status === 401) {
    throw new CustomerAuthError("Customer access token rejected by Shopify.", 401);
  }

  const payload = (await response.json().catch(() => ({}))) as GraphQLResponse<T>;
  if (payload.data == null) {
    const detail = payload.errors?.map((e) => e.message).join("; ") ?? `HTTP ${response.status}`;
    throw new CustomerAuthError(`Customer Account API error: ${detail}`, 502);
  }
  // Partial responses are tolerated the same way the Storefront client
  // tolerates them: a missing optional field must not blank the whole page.
  if (payload.errors?.length) {
    console.warn("[shopify] customer account partial response:", payload.errors);
  }
  return payload.data;
}

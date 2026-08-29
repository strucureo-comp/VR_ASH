import { CustomerAuthError, refreshTokens } from "./customer.server";
import { siteOrigin } from "./env.server";
import {
  SESSION_COOKIE,
  clearedCookie,
  readSession,
  sessionCookie,
  type CustomerSession,
} from "./session.server";

/**
 * Turns a request's cookie header into a usable customer access token, renewing
 * it first when it has expired.
 *
 * Refresh happens here rather than in the routes because a shopper stays signed
 * in for weeks while an access token lasts a couple of hours — so almost every
 * authenticated page view after the first day would otherwise 401 and bounce
 * them back to sign-in.
 *
 * `cookie` is non-null whenever the browser's copy is now wrong: a rotated token
 * to store, or a cleared cookie because the session cannot be recovered. Callers
 * must put it on the response they return, or the next request repeats the work.
 *
 * Framework-agnostic on purpose — it takes a header string and returns a header
 * string, so the Next.js port reuses it.
 */
export type ResolvedSession = {
  session: CustomerSession | null;
  /** A `Set-Cookie` value that must be sent, or `null` to leave the cookie be. */
  cookie: string | null;
};

const SIGNED_OUT: ResolvedSession = { session: null, cookie: null };

export async function resolveSession(cookieHeader: string | null): Promise<ResolvedSession> {
  const session = await readSession(cookieHeader);
  if (!session) return SIGNED_OUT;
  if (session.expiresAt > Date.now()) return { session, cookie: null };

  try {
    const tokens = await refreshTokens(session.refreshToken, siteOrigin());
    return { session: tokens, cookie: await sessionCookie(tokens) };
  } catch (error) {
    // A refresh token Shopify no longer recognises is the normal end of a long
    // session, not an outage — clear it and let the shopper sign in again.
    if (error instanceof CustomerAuthError && error.status < 500) {
      return { session: null, cookie: clearedCookie(SESSION_COOKIE) };
    }
    throw error;
  }
}

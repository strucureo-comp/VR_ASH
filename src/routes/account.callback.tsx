import { createFileRoute } from "@tanstack/react-router";

import {
  customerAccountsEnabled,
  decodeIdTokenClaims,
  exchangeCode,
} from "@/lib/shopify/customer.server";
import { siteOrigin } from "@/lib/shopify/env.server";
import {
  OAUTH_COOKIE,
  clearedCookie,
  readOAuthTransaction,
  sessionCookie,
} from "@/lib/shopify/session.server";

/**
 * Where Shopify sends the shopper back to. Exchanges the one-time code for
 * tokens and turns them into our sealed session cookie.
 *
 * Every failure path lands on `/account?signin=failed&reason=…` rather than back
 * on `/account/login`: bouncing to login would restart the same flow that just
 * broke and loop the browser. `/account` therefore has to render that state
 * instead of redirecting an anonymous visitor straight to sign-in.
 *
 * Handler-only, like the other two account routes — see `account.login.tsx`.
 */
export const Route = createFileRoute("/account/callback")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        if (!customerAccountsEnabled()) return failed("unavailable");

        const url = new URL(request.url);
        const cookieHeader = request.headers.get("cookie");
        const transaction = await readOAuthTransaction(cookieHeader);

        // Shopify reports its own refusals here (access_denied when the shopper
        // backs out of the code screen, invalid_request for a bad client).
        if (url.searchParams.get("error")) return failed("denied");
        if (!transaction) return failed("expired");

        const code = url.searchParams.get("code");
        // A mismatched `state` means this callback was not started by this
        // browser, so the code is not ours to spend.
        if (!code || url.searchParams.get("state") !== transaction.state) {
          return failed("state");
        }

        try {
          const tokens = await exchangeCode({
            code,
            codeVerifier: transaction.codeVerifier,
            redirectUri: `${siteOrigin()}/account/callback`,
            origin: siteOrigin(),
          });

          // The nonce ties the id token to this same sign-in attempt. Absent
          // claims are tolerated (the token is optional in the response); a
          // present-but-wrong nonce is not.
          const claims = decodeIdTokenClaims(tokens.idToken);
          if (claims?.nonce && claims.nonce !== transaction.nonce) return failed("nonce");

          const headers = new Headers({
            location: transaction.returnTo,
            "cache-control": "no-store",
          });
          // Two cookies on one response: `append`, not `set` — `set` would drop
          // the first of them.
          headers.append("set-cookie", await sessionCookie(tokens));
          headers.append("set-cookie", clearedCookie(OAUTH_COOKIE));
          return new Response(null, { status: 302, headers });
        } catch (error) {
          console.error("[shopify] customer sign-in failed:", error);
          return failed("exchange");
        }
      },
    },
  },
});

/**
 * Clears the in-flight transaction on the way out so a retry starts clean
 * instead of replaying a verifier that has already been spent or expired.
 */
function failed(reason: string): Response {
  const headers = new Headers({
    location: `/account?signin=failed&reason=${reason}`,
    "cache-control": "no-store",
  });
  headers.append("set-cookie", clearedCookie(OAUTH_COOKIE));
  return new Response(null, { status: 302, headers });
}

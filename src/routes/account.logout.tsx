import { createFileRoute } from "@tanstack/react-router";

import { customerAccountsEnabled, logoutUrl } from "@/lib/shopify/customer.server";
import { siteOrigin } from "@/lib/shopify/env.server";
import {
  OAUTH_COOKIE,
  SESSION_COOKIE,
  clearedCookie,
  readSession,
} from "@/lib/shopify/session.server";

/**
 * Signs the shopper out of this site *and* of Shopify. Clearing our own cookie
 * alone would leave the Shopify session alive, so the next "Sign in" would come
 * straight back signed in without ever asking for a code — which does not look
 * like a logout to anyone using a shared device.
 *
 * `id_token_hint` is required by the end-session endpoint, which is the only
 * reason the id token is kept in the session at all. Without a session there is
 * nothing to hint with, so this just returns home.
 *
 * Handler-only, like the other two account routes — see `account.login.tsx`.
 */
export const Route = createFileRoute("/account/logout")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const session = customerAccountsEnabled()
          ? await readSession(request.headers.get("cookie"))
          : null;

        // `post_logout_redirect_uri` has to be in the channel's Logout URI
        // allowlist; Shopify shows its own error page rather than redirecting
        // when it is not.
        const location = session ? logoutUrl(session.idToken, siteOrigin()) : "/";

        const headers = new Headers({ location, "cache-control": "no-store" });
        // Cleared unconditionally: a session that failed to unseal still leaves
        // a stale cookie in the browser, and it should not survive a logout.
        headers.append("set-cookie", clearedCookie(SESSION_COOKIE));
        headers.append("set-cookie", clearedCookie(OAUTH_COOKIE));
        return new Response(null, { status: 302, headers });
      },
    },
  },
});

import { createFileRoute } from "@tanstack/react-router";

import {
  authorizeUrl,
  codeChallenge,
  customerAccountsEnabled,
  randomString,
} from "@/lib/shopify/customer.server";
import { siteOrigin } from "@/lib/shopify/env.server";
import { oauthCookie } from "@/lib/shopify/session.server";

/**
 * Starts sign-in. There is no login form and no signup page anywhere in this
 * app on purpose: Shopify hosts the email + one-time-code screen, and entering a
 * code for an unrecognised email creates the customer. So this route only builds
 * the authorization request and hands the shopper over.
 *
 * It is a server handler with no component, which means the client route tree
 * drops it entirely — link to it with a plain `<a href>`, never a `<Link>`, or
 * the router will try to navigate client-side to a route that does not exist
 * there.
 */
export const Route = createFileRoute("/account/login")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        if (!customerAccountsEnabled()) {
          return new Response(
            "Customer accounts are not configured for this store yet.",
            unavailable,
          );
        }

        const url = new URL(request.url);
        const verifier = randomString();
        const transaction = {
          codeVerifier: verifier,
          state: randomString(),
          nonce: randomString(),
          returnTo: safeReturnTo(url.searchParams.get("returnTo")),
        };

        const location = authorizeUrl({
          redirectUri: `${siteOrigin()}/account/callback`,
          state: transaction.state,
          nonce: transaction.nonce,
          codeChallenge: await codeChallenge(verifier),
        });

        return new Response(null, {
          status: 302,
          headers: {
            location,
            // The verifier must survive the round trip to Shopify and back, and
            // must not be readable by script — it is the proof that the code
            // being exchanged was requested by this browser.
            "set-cookie": await oauthCookie(transaction),
            "cache-control": "no-store",
          },
        });
      },
    },
  },
});

const unavailable = {
  status: 503,
  headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" },
};

/**
 * Only same-site paths. An attacker who can choose `returnTo` on someone else's
 * sign-in gets an open redirect off a URL the shopper has every reason to trust,
 * so a leading `//` or a scheme is rejected outright rather than sanitised.
 */
function safeReturnTo(value: string | null): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/account";
  if (/[\r\n\t]/.test(value)) return "/account";
  return value;
}

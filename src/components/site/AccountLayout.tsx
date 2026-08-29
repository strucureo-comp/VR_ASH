import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

import { Section } from "./Section";

/**
 * Shared chrome for the account pages.
 *
 * Every link out to `/account/login` and `/account/logout` is a plain `<a>`, not
 * a `<Link>`: those routes are server handlers with no component, so the client
 * route tree does not contain them and a `<Link>` would try to navigate to a
 * route that is not there.
 */

const TABS = [
  { to: "/account", label: "Overview" },
  { to: "/account/orders", label: "Orders" },
  { to: "/account/addresses", label: "Addresses" },
] as const;

export function AccountShell({
  heading,
  intro,
  children,
}: {
  heading: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <Section className="bg-[color:var(--surface)]">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="eyebrow text-[color:var(--gold)]">Your account</span>
          <h1 className="mt-3 text-[1.75rem] leading-tight text-foreground sm:text-4xl">
            {heading}
          </h1>
          {intro ? (
            <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
              {intro}
            </p>
          ) : null}
        </div>
        <a
          href="/account/logout"
          className="inline-flex min-h-10 items-center rounded-full border border-border px-4 text-sm text-muted-foreground transition-colors sm:hover:border-[color:var(--gold)] sm:hover:text-primary"
        >
          Sign out
        </a>
      </div>

      <nav className="mt-8 flex flex-wrap gap-2 border-b border-border pb-3">
        {TABS.map((tab) => (
          <Link
            key={tab.to}
            to={tab.to}
            activeOptions={{ exact: tab.to === "/account" }}
            className="inline-flex min-h-10 items-center rounded-full px-4 text-sm text-muted-foreground transition-colors sm:hover:text-primary [&.active]:bg-card [&.active]:text-primary"
          >
            {tab.label}
          </Link>
        ))}
      </nav>

      <div className="mt-10">{children}</div>
    </Section>
  );
}

/**
 * Shown instead of the account pages when there is no session. Sign-in is a
 * one-way trip out to Shopify's hosted email + code screen, so there is no form
 * here and no password anywhere in this app.
 */
export function SignInPrompt({
  returnTo = "/account",
  reason,
  notice,
}: {
  returnTo?: string;
  reason?: string | undefined;
  /** Good news to lead with — e.g. a guest returning from a completed checkout. */
  notice?: string | undefined;
}) {
  const message = reason ? SIGN_IN_FAILURES[reason] : null;

  return (
    <Section className="bg-[color:var(--surface)]">
      <div className="mx-auto max-w-md text-center">
        <span className="eyebrow text-[color:var(--gold)]">Your account</span>
        <h1 className="mt-3 text-[1.75rem] leading-tight text-foreground sm:text-4xl">Sign in</h1>
        {notice ? (
          <p className="mt-6 rounded-lg border border-[color:var(--gold)]/40 bg-card p-4 text-sm leading-relaxed text-foreground">
            {notice}
          </p>
        ) : null}
        <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
          We email you a one-time code — no password to remember. Signing in for the first time
          creates your account.
        </p>
        {message ? (
          <p
            role="alert"
            className="mt-6 rounded-lg border border-[color:var(--burgundy)]/30 bg-card p-4 text-sm text-[color:var(--burgundy)]"
          >
            {message}
          </p>
        ) : null}
        <a
          href={`/account/login?returnTo=${encodeURIComponent(returnTo)}`}
          className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-8 text-sm font-medium text-primary-foreground transition-colors sm:hover:bg-[color:var(--botanical-deep)]"
        >
          Continue with email
        </a>
      </div>
    </Section>
  );
}

/**
 * `/account/callback` puts one of these keys in `?reason=` when sign-in does not
 * complete. Anything unrecognised shows nothing rather than leaking a raw code.
 */
const SIGN_IN_FAILURES: Record<string, string> = {
  unavailable: "Accounts are not available on this store yet. Please contact us to order.",
  denied: "Sign-in was cancelled. You can try again whenever you like.",
  expired: "That sign-in link timed out. Please start again.",
  state: "We could not verify that sign-in request. Please start again.",
  nonce: "We could not verify that sign-in request. Please start again.",
  exchange: "Something went wrong signing you in. Please try again in a moment.",
};

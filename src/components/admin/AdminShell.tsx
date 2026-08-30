import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";

import { Section } from "@/components/site/Section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { AdminSession } from "@/lib/admin/useAdminSession";

/**
 * Chrome and gate for the two admin screens.
 *
 * The signed-out state is an early return rather than a `beforeLoad` redirect,
 * matching `SignInPrompt`: the session lives in the Firebase SDK in the browser,
 * so the server has nothing to redirect on. Rendering a form here is also why the
 * `admins/{uid}` check exists — the route is reachable by anyone, the database is
 * not.
 */

const TABS = [
  { to: "/admin", label: "Products" },
  { to: "/admin/enquiries", label: "Enquiries" },
] as const;

export function AdminShell({
  session,
  heading,
  intro,
  children,
}: {
  session: AdminSession;
  heading: string;
  intro?: string;
  children: ReactNode;
}) {
  if (session.status === "unconfigured") {
    return (
      <Notice heading="Not configured">
        The <code>FIREBASE_*</code> variables are missing. Add them to <code>.env.local</code> and
        restart the dev server.
      </Notice>
    );
  }

  if (session.status === "signed-out") return <SignIn session={session} />;

  // Covers both the SDK loading and the `admins/{uid}` lookup, which is why it is
  // not a spinner on top of the real screen: until it settles we do not know
  // whether this account may see the screen at all.
  if (session.status === "loading") {
    return (
      <Section className="bg-[color:var(--surface)]">
        <div className="mx-auto max-w-md space-y-3" aria-busy="true" aria-live="polite">
          <div className="h-10 w-40 animate-pulse rounded-full bg-card" />
          <div className="h-40 animate-pulse rounded-xl border border-border bg-card" />
          <span className="sr-only">Checking your access…</span>
        </div>
      </Section>
    );
  }

  if (session.status === "denied") {
    return (
      <Notice heading="Not an admin">
        <span className="block">
          {session.email} is signed in but is not on the admin list, so nothing here can be read or
          changed.
        </span>
        {/* The uid is the one thing needed to fix this, and the Firebase console
            truncates it in the users table — so it is shown here, ready to copy. */}
        {session.uid ? (
          <span className="mt-4 block text-left">
            <span className="block text-xs tracking-wide text-muted-foreground uppercase">
              To allow this account, set
            </span>
            <code className="mt-1.5 block overflow-x-auto rounded-lg border border-border bg-[color:var(--surface)] p-3 text-xs break-all text-foreground">
              admins/{session.uid} = true
            </code>
            <span className="mt-1.5 block text-xs text-muted-foreground">
              Realtime Database → Data, as a boolean.
            </span>
          </span>
        ) : null}
        <Button
          variant="outline"
          className="mt-6 min-h-10 rounded-full"
          disabled={session.busy}
          onClick={() => void session.signOut()}
        >
          Sign out
        </Button>
      </Notice>
    );
  }

  return (
    <Section className="bg-[color:var(--surface)]">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="eyebrow text-[color:var(--gold)]">Admin</span>
          <h1 className="mt-3 text-[1.75rem] leading-tight text-foreground sm:text-4xl">
            {heading}
          </h1>
          {intro ? (
            <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
              {intro}
            </p>
          ) : null}
        </div>
        <div className="flex flex-col items-start gap-1">
          {session.email ? (
            <span className="text-xs text-muted-foreground">{session.email}</span>
          ) : null}
          <button
            type="button"
            disabled={session.busy}
            onClick={() => void session.signOut()}
            className="inline-flex min-h-10 items-center rounded-full border border-border px-4 text-sm text-muted-foreground transition-colors sm:hover:border-[color:var(--gold)] sm:hover:text-primary"
          >
            Sign out
          </button>
        </div>
      </div>

      <nav className="mt-8 flex flex-wrap gap-2 border-b border-border pb-3">
        {TABS.map((tab) => (
          <Link
            key={tab.to}
            to={tab.to}
            activeOptions={{ exact: tab.to === "/admin" }}
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
 * Email and password, straight to Firebase Auth. Deliberately unlike the
 * storefront's `SignInPrompt`, which is passwordless because Shopify hosts it —
 * customers and admins are different systems and share no session.
 */
function SignIn({ session }: { session: AdminSession }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <Section className="bg-[color:var(--surface)]">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          void session.signIn(email, password);
        }}
        className="mx-auto max-w-md rounded-xl border border-border bg-card p-6 shadow-xl sm:p-8"
      >
        <span className="eyebrow text-[color:var(--gold)]">Admin</span>
        <h1 className="mt-3 text-[1.5rem] leading-tight text-foreground sm:text-3xl">Sign in</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Product content and enquiries. Staff accounts only.
        </p>

        <div className="mt-6 space-y-4">
          <div>
            <Label htmlFor="admin-email">Email</Label>
            <Input
              id="admin-email"
              name="email"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="admin-password">Password</Label>
            <Input
              id="admin-password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2"
            />
          </div>
        </div>

        {session.error ? (
          <p
            role="alert"
            className="mt-5 rounded-lg border border-[color:var(--burgundy)]/30 bg-[color:var(--surface)] p-3 text-sm text-[color:var(--burgundy)]"
          >
            {session.error}
          </p>
        ) : null}

        <Button
          type="submit"
          size="lg"
          disabled={session.busy}
          className="mt-6 w-full rounded-full sm:w-auto sm:px-8"
        >
          {session.busy ? "Signing in…" : "Sign in"}
        </Button>
      </form>
    </Section>
  );
}

function Notice({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <Section className="bg-[color:var(--surface)]">
      <div className="mx-auto max-w-md rounded-xl border border-border bg-card p-6 text-center sm:p-8">
        <span className="eyebrow text-[color:var(--gold)]">Admin</span>
        <h1 className="mt-3 text-[1.5rem] leading-tight text-foreground sm:text-3xl">{heading}</h1>
        <div className="mt-4 text-sm leading-relaxed text-muted-foreground">{children}</div>
      </div>
    </Section>
  );
}

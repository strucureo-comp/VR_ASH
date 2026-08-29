import { createFileRoute, Link } from "@tanstack/react-router";
import { Package, MapPin } from "lucide-react";

import { AccountShell, SignInPrompt } from "@/components/site/AccountLayout";
import { accountQuery } from "@/lib/shopify/queryOptions";

/**
 * Account overview. Also the landing spot for a sign-in that did not complete —
 * `/account/callback` sends failures here with `?signin=failed&reason=…` rather
 * than back to `/account/login`, which would restart the same broken flow and
 * loop the browser.
 */
export const Route = createFileRoute("/account/")({
  // The key is declared optional, not `string | undefined`: a required key would
  // force every `<Link to="/account">` in the app to pass a `search` prop.
  validateSearch: (search: Record<string, unknown>): { reason?: string } => {
    const reason = search["reason"];
    return typeof reason === "string" ? { reason } : {};
  },
  loader: async ({ context }) => ({
    account: await context.queryClient.ensureQueryData(accountQuery()),
  }),
  head: () => ({
    meta: [
      { title: "Your account | Vallalaar Remedies" },
      // Nothing under /account should be indexed, and neither should the
      // sign-in prompt that stands in for it when signed out.
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AccountOverview,
});

function AccountOverview() {
  const { account } = Route.useLoaderData();
  const { reason } = Route.useSearch();

  if (!account) return <SignInPrompt returnTo="/account" reason={reason} />;

  const name = account.firstName?.trim() ?? "";

  return (
    <AccountShell
      heading={name ? `Hello, ${name}` : "Your account"}
      intro="Your orders, addresses and contact details."
    >
      <dl className="grid gap-6 rounded-xl border border-border bg-card p-6 sm:grid-cols-2">
        <Field label="Name" value={account.displayName} />
        <Field label="Email" value={account.email} />
        <Field label="Phone" value={account.phone} />
      </dl>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Tile
          to="/account/orders"
          icon={<Package className="h-4 w-4" />}
          title="Orders"
          body="Track a delivery or look back at what you have ordered."
        />
        <Tile
          to="/account/addresses"
          icon={<MapPin className="h-4 w-4" />}
          title="Addresses"
          body={
            account.defaultAddress
              ? account.defaultAddress.formatted.join(", ")
              : "Add a delivery address to speed up checkout."
          }
        />
      </div>
    </AccountShell>
  );
}

function Field({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <dt className="eyebrow text-muted-foreground">{label}</dt>
      <dd className="mt-2 text-[15px] text-foreground">
        {value?.trim() ? value : <span className="text-muted-foreground">Not set</span>}
      </dd>
    </div>
  );
}

function Tile({
  to,
  icon,
  title,
  body,
}: {
  to: "/account/orders" | "/account/addresses";
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <Link
      to={to}
      className="group flex flex-col rounded-xl border border-border bg-card p-6 transition-colors sm:hover:border-[color:var(--gold)]"
    >
      <span className="inline-flex items-center gap-2 text-[color:var(--gold)]">
        {icon}
        <span className="eyebrow">{title}</span>
      </span>
      <span className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
        {body}
      </span>
    </Link>
  );
}

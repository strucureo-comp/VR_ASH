import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { AccountShell, SignInPrompt } from "@/components/site/AccountLayout";
import { formatMoney, formatOrderDate, orderPathId, statusLabel } from "@/lib/shopify/format";
import { ordersQuery } from "@/lib/shopify/queryOptions";
import type { OrderSummary } from "@/lib/shopify/types";

/**
 * Order history. Reads from the Customer Account API, so an order placed on any
 * channel — this site, a phone order keyed into Admin — shows up here without
 * anything being mirrored into a database of our own.
 */
export const Route = createFileRoute("/account/orders/")({
  loader: async ({ context }) => ({
    orders: await context.queryClient.ensureQueryData(ordersQuery(20)),
  }),
  head: () => ({
    meta: [
      { title: "Your orders | Vallalaar Remedies" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: Orders,
});

function Orders() {
  const { orders } = Route.useLoaderData();

  if (!orders) return <SignInPrompt returnTo="/account/orders" />;

  return (
    <AccountShell heading="Orders" intro="Newest first. Open one for its items and tracking.">
      {orders.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-10 text-center">
          <p className="text-sm text-muted-foreground">You have not placed an order yet.</p>
          <Link
            to="/products"
            className="mt-6 inline-flex min-h-12 items-center rounded-full bg-primary px-8 text-sm font-medium text-primary-foreground transition-colors sm:hover:bg-[color:var(--botanical-deep)]"
          >
            Browse the range
          </Link>
        </div>
      ) : (
        <ul className="grid gap-4">
          {orders.map((order) => (
            <li key={order.id}>
              <OrderRow order={order} />
            </li>
          ))}
        </ul>
      )}
    </AccountShell>
  );
}

function OrderRow({ order }: { order: OrderSummary }) {
  return (
    <Link
      to="/account/orders/$id"
      params={{ id: orderPathId(order.id) }}
      className="group flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-card p-5 transition-colors sm:hover:border-[color:var(--gold)] sm:p-6"
    >
      <div>
        <p className="font-display text-xl text-foreground">{order.name}</p>
        <p className="mt-1 text-xs text-muted-foreground">{formatOrderDate(order.processedAt)}</p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Badge>{statusLabel(order.fulfillmentStatus)}</Badge>
        {order.financialStatus ? <Badge>{statusLabel(order.financialStatus)}</Badge> : null}
      </div>
      <div className="flex items-center gap-3">
        <span className="font-display text-lg text-foreground">{formatMoney(order.total)}</span>
        <ArrowRight className="h-4 w-4 text-[color:var(--gold)] transition-transform sm:group-hover:translate-x-1" />
      </div>
    </Link>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-[color:var(--surface)] px-3 py-1 text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
      {children}
    </span>
  );
}

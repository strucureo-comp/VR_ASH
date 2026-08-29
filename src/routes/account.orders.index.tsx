import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { ArrowRight, CheckCircle2, RotateCw } from "lucide-react";

import { AccountShell, SignInPrompt } from "@/components/site/AccountLayout";
import { useCart } from "@/components/site/CartProvider";
import { formatMoney, formatOrderDate, orderPathId, statusLabel } from "@/lib/shopify/format";
import { ordersQuery } from "@/lib/shopify/queryOptions";
import type { OrderSummary } from "@/lib/shopify/types";

/**
 * Order history. Reads from the Customer Account API, so an order placed on any
 * channel — this site, a phone order keyed into Admin — shows up here without
 * anything being mirrored into a database of our own.
 *
 * Doubles as the landing page for a shopper coming back from a completed
 * checkout, which arrives as `?ordered=1`.
 */
export const Route = createFileRoute("/account/orders/")({
  /**
   * The key is declared optional, not `boolean | undefined`: a required key would
   * force every `<Link to="/account/orders">` in the app to pass a `search` prop.
   */
  validateSearch: (search: Record<string, unknown>): { ordered?: boolean } =>
    search["ordered"] === "1" || search["ordered"] === true ? { ordered: true } : {},
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
  const { ordered } = Route.useSearch();
  const { clear } = useCart();

  // The Shopify cart stops resolving once it becomes an order, so `CartProvider`
  // would drop it on its next fetch anyway — but a shopper who has just paid
  // should never see a stale badge in the header for even one render.
  useEffect(() => {
    if (ordered) clear();
  }, [ordered, clear]);

  if (!orders) {
    return (
      <SignInPrompt
        returnTo="/account/orders"
        notice={
          ordered
            ? "Thank you — your order is confirmed and a receipt is on its way by email. Sign in with the same email address to track it here."
            : undefined
        }
      />
    );
  }

  return (
    <AccountShell heading="Orders" intro="Newest first. Open one for its items and tracking.">
      {ordered ? <OrderPlacedNotice /> : null}
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

/**
 * Shown on return from a completed checkout. It offers a refresh because Shopify
 * takes a moment to make a brand-new order readable through the Customer Account
 * API — without this, a shopper who paid seconds ago can land on an order list
 * that does not include what they just bought.
 */
function OrderPlacedNotice() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const refresh = async () => {
    await queryClient.invalidateQueries({ queryKey: ["shopify", "orders"] });
    await router.invalidate();
  };

  return (
    <div className="mb-8 rounded-xl border border-[color:var(--gold)]/40 bg-card p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[color:var(--botanical-deep)]" />
        <div>
          <p className="font-display text-lg text-foreground">
            Thank you — your order is confirmed
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            A receipt is on its way to your email. If it is not listed yet, give it a few seconds
            and refresh.
          </p>
          <button
            type="button"
            onClick={() => void refresh()}
            className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-full border border-border px-4 text-sm text-muted-foreground transition-colors sm:hover:border-[color:var(--gold)] sm:hover:text-primary"
          >
            <RotateCw className="h-3.5 w-3.5" />
            Refresh
          </button>
        </div>
      </div>
    </div>
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

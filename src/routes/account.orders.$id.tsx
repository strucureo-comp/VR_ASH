import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ExternalLink } from "lucide-react";

import { AccountShell, SignInPrompt } from "@/components/site/AccountLayout";
import {
  formatMoney,
  formatOrderDate,
  orderGid,
  sizedImage,
  statusLabel,
} from "@/lib/shopify/format";
import { orderQuery } from "@/lib/shopify/queryOptions";
import type { Money, OrderDetail } from "@/lib/shopify/types";

/**
 * One order. Tracking, refunds and returns all stay on Shopify's own status page
 * — `statusPageUrl` is a signed link to it, so there is nothing to rebuild here
 * and no carrier integration to maintain.
 */
export const Route = createFileRoute("/account/orders/$id")({
  loader: async ({ context, params }) => ({
    result: await context.queryClient.ensureQueryData(orderQuery(orderGid(params.id))),
  }),
  head: () => ({
    meta: [
      { title: "Order | Vallalaar Remedies" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: OrderPage,
});

function OrderPage() {
  const { result } = Route.useLoaderData();
  const { id } = Route.useParams();

  if (!result) return <SignInPrompt returnTo={`/account/orders/${id}`} />;

  // Signed in, but Shopify did not return the order: it belongs to someone else,
  // or the id was edited by hand. Both are the same non-answer to the shopper.
  if (!result.order) {
    return (
      <AccountShell heading="Order not found">
        <p className="text-sm text-muted-foreground">
          We could not find that order on your account.
        </p>
        <BackLink />
      </AccountShell>
    );
  }

  return <OrderBody order={result.order} />;
}

function OrderBody({ order }: { order: OrderDetail }) {
  return (
    <AccountShell heading={order.name} intro={`Placed ${formatOrderDate(order.processedAt)}`}>
      <div className="flex flex-wrap items-center gap-2">
        <Badge>{statusLabel(order.fulfillmentStatus)}</Badge>
        {order.financialStatus ? <Badge>{statusLabel(order.financialStatus)}</Badge> : null}
        {order.statusPageUrl ? (
          <a
            href={order.statusPageUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-10 items-center gap-2 rounded-full border border-border px-4 text-sm text-muted-foreground transition-colors sm:hover:border-[color:var(--gold)] sm:hover:text-primary"
          >
            Track this order
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        ) : null}
      </div>

      <ul className="mt-8 divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
        {order.lines.map((line, index) => (
          <li key={`${line.title}-${index}`} className="flex gap-4 p-5 sm:p-6">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-[color:var(--ivory)]">
              {line.image ? (
                <img
                  src={sizedImage(line.image.url, 160)}
                  alt={line.image.altText ?? line.title}
                  loading="lazy"
                  className="h-full w-full object-contain p-2"
                />
              ) : (
                <span className="font-display text-lg text-muted-foreground">
                  {line.title.charAt(0)}
                </span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[15px] text-foreground">{line.title}</p>
              {line.variantTitle ? (
                <p className="mt-0.5 text-xs text-muted-foreground">{line.variantTitle}</p>
              ) : null}
              <p className="mt-1 text-xs text-muted-foreground">Qty {line.quantity}</p>
            </div>
            {line.total ? (
              <span className="shrink-0 text-[15px] text-foreground">
                {formatMoney(line.total)}
              </span>
            ) : null}
          </li>
        ))}
      </ul>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <dl className="rounded-xl border border-border bg-card p-6 text-sm">
          <Row label="Subtotal" value={order.subtotal} />
          <Row label="Shipping" value={order.shipping} />
          <Row label="Tax" value={order.tax} />
          <div className="mt-3 flex items-baseline justify-between border-t border-border pt-3">
            <dt className="text-foreground">Total</dt>
            <dd className="font-display text-xl text-foreground">{formatMoney(order.total)}</dd>
          </div>
        </dl>

        {order.shippingAddress ? (
          <div className="rounded-xl border border-border bg-card p-6">
            <p className="eyebrow text-muted-foreground">Delivering to</p>
            <address className="mt-3 text-sm not-italic leading-relaxed text-foreground">
              {order.shippingAddress.formatted.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </address>
          </div>
        ) : null}
      </div>

      <BackLink />
    </AccountShell>
  );
}

function Row({ label, value }: { label: string; value: Money | null }) {
  if (!value) return null;
  return (
    <div className="flex items-baseline justify-between py-1.5">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-foreground">{formatMoney(value)}</dd>
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-[color:var(--surface)] px-3 py-1 text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
      {children}
    </span>
  );
}

function BackLink() {
  return (
    <Link
      to="/account/orders"
      className="mt-8 inline-flex min-h-10 items-center gap-2 text-sm text-muted-foreground transition-colors sm:hover:text-primary"
    >
      <ArrowLeft className="h-4 w-4" />
      All orders
    </Link>
  );
}

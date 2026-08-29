import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2, Lock, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { useCart } from "@/components/site/CartProvider";
import { formatMoney, sizedImage, variantLabel } from "@/lib/shopify/format";
import { WA_ENQUIRY } from "@/lib/site";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart | Vallalaar Remedies" },
      {
        name: "description",
        content:
          "Review the products in your cart and check out securely. Payment, shipping and taxes are handled by our Shopify checkout.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Your Cart | Vallalaar Remedies" },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { cart, count, loading, setQty, remove, attachCustomer } = useCart();
  const [redirecting, setRedirecting] = useState(false);
  const lines = cart?.lines ?? [];

  const checkout = async () => {
    if (!cart) return;
    setRedirecting(true);
    // If the shopper is signed in, link the cart to their account first so
    // checkout arrives pre-filled and the order lands in their order history.
    // Guests get `null` back and carry straight on.
    const url = (await attachCustomer()) ?? cart.checkoutUrl;
    // Shopify's hosted checkout owns address, shipping and payment. Do not
    // rebuild those forms here — card data must never touch this origin.
    window.location.href = url;
  };

  return (
    <>
      <section className="border-b border-border bg-[color:var(--surface)] px-5 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-6xl">
          <p className="eyebrow text-[color:var(--gold)]">Order</p>
          <h1 className="mt-4 text-[2rem] leading-tight text-foreground sm:text-4xl lg:text-5xl">
            Your Cart
          </h1>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
            Review your items, then check out securely. Shipping and taxes are calculated at
            checkout.
          </p>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 sm:gap-14 sm:px-6 sm:py-16 lg:grid-cols-[1.3fr_1fr]">
        {/* CART ITEMS */}
        <Reveal>
          <h2 className="text-2xl text-foreground">
            Selected Products{count > 0 ? ` (${count})` : ""}
          </h2>

          {lines.length === 0 ? (
            <div className="mt-6 rounded-lg border border-dashed border-border p-10 text-center">
              <ShoppingBag className="mx-auto h-7 w-7 text-muted-foreground" />
              <p className="mt-4 text-sm text-muted-foreground">Your cart is empty.</p>
              <Link
                to="/products"
                className="mt-5 inline-flex min-h-12 items-center rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground"
              >
                Browse products
              </Link>
            </div>
          ) : (
            <ul className="mt-6 divide-y divide-border border-y border-border">
              {lines.map((line) => {
                const label = variantLabel(line.variantTitle);
                const name = `${line.productTitle}${label ? ` ${label}` : ""}`;
                return (
                  <li
                    key={line.id}
                    className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center"
                  >
                    {line.image && (
                      <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-md border border-border bg-[color:var(--ivory)] p-2">
                        <img
                          src={sizedImage(line.image.url, 160)}
                          alt={name}
                          loading="lazy"
                          className="h-full w-auto object-contain"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <Link
                        to="/products/$slug"
                        params={{ slug: line.productHandle }}
                        className="text-lg text-foreground sm:hover:text-primary"
                      >
                        {line.productTitle}
                      </Link>
                      {label && <p className="mt-1 text-xs text-muted-foreground">{label}</p>}
                      <p className="mt-1 text-xs text-muted-foreground">
                        {formatMoney(line.unitPrice)} each
                      </p>
                      {!line.availableForSale && (
                        <p className="mt-1 text-xs text-[color:var(--burgundy)]">
                          Out of stock — remove this item to check out.
                        </p>
                      )}
                    </div>
                    <div className="flex items-center justify-between gap-3 sm:justify-end">
                      <div className="flex items-center rounded-full border border-border">
                        <button
                          type="button"
                          aria-label={`Decrease ${name}`}
                          disabled={loading}
                          onClick={() => void setQty(line.id, line.quantity - 1)}
                          className="min-h-10 px-3 text-muted-foreground disabled:opacity-40 sm:hover:text-primary"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="min-w-6 text-center text-sm text-foreground">
                          {line.quantity}
                        </span>
                        <button
                          type="button"
                          aria-label={`Increase ${name}`}
                          disabled={loading || line.quantity >= 99}
                          onClick={() => void setQty(line.id, line.quantity + 1)}
                          className="min-h-10 px-3 text-muted-foreground disabled:opacity-40 sm:hover:text-primary"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <p className="min-w-20 text-right font-display text-lg text-foreground">
                        {formatMoney(line.lineTotal)}
                      </p>
                      <button
                        type="button"
                        aria-label={`Remove ${name}`}
                        disabled={loading}
                        onClick={() => void remove(line.id)}
                        className="text-muted-foreground transition-colors disabled:opacity-40 sm:hover:text-[color:var(--burgundy)]"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
          <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
            Soliderma is an Ayurvedic proprietary medicine — please follow professional medical
            guidance for deep, infected or non-healing wounds.
          </p>
        </Reveal>

        {/* ORDER SUMMARY */}
        <Reveal delay={0.1}>
          <div className="rounded-lg border border-border bg-card p-6 sm:p-8">
            <h2 className="text-2xl text-foreground">Order Summary</h2>

            <dl className="mt-7 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd className="text-foreground">
                  {cart
                    ? formatMoney(cart.subtotal)
                    : formatMoney({ amount: 0, currencyCode: "INR" })}
                </dd>
              </div>
              {cart?.tax && cart.tax.amount > 0 && (
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Tax</dt>
                  <dd className="text-foreground">{formatMoney(cart.tax)}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Shipping</dt>
                <dd className="text-muted-foreground">Calculated at checkout</dd>
              </div>
              <div className="flex justify-between border-t border-border pt-3">
                <dt className="text-foreground">Total</dt>
                <dd className="font-display text-xl text-foreground">
                  {cart ? formatMoney(cart.total) : "—"}
                </dd>
              </div>
            </dl>

            <button
              type="button"
              onClick={() => void checkout()}
              disabled={!cart || lines.length === 0 || loading || redirecting}
              className="mt-8 inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-full bg-[color:var(--burgundy)] px-7 text-sm font-medium text-primary-foreground transition-opacity disabled:cursor-not-allowed disabled:opacity-50 sm:hover:opacity-90"
            >
              {redirecting || loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Lock className="h-4 w-4" />
              )}
              {redirecting ? "Opening checkout…" : "Checkout"}
            </button>
            <p className="mt-3 text-center text-[11px] leading-relaxed text-muted-foreground">
              Payment is processed securely by Shopify. You will enter your delivery address and
              payment details on the next step.
            </p>

            <p className="mt-6 border-t border-border pt-5 text-xs leading-relaxed text-muted-foreground">
              Questions before ordering?{" "}
              <a
                href={WA_ENQUIRY}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[color:var(--burgundy)] underline-offset-4 sm:hover:underline"
              >
                Ask us on WhatsApp
              </a>
              .
            </p>
          </div>
        </Reveal>
      </div>
    </>
  );
}

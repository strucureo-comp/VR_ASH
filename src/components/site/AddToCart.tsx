import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ShoppingBag, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "./CartProvider";
import { NotifyMe } from "./NotifyMe";
import { variantLabel } from "@/lib/shopify/format";
import type { Product, ProductVariant } from "@/lib/shopify/types";

/** Below this, the card nudges the shopper rather than staying silent. */
const LOW_STOCK_THRESHOLD = 5;

function firstSellable(variants: ProductVariant[]): ProductVariant | null {
  return variants.find((v) => v.availableForSale) ?? variants[0] ?? null;
}

export function AddToCart({
  product,
  compact = false,
  variants,
}: {
  product: Product;
  compact?: boolean;
  /** Restrict the picker to a subset — used by the per-size cards on /soliderma. */
  variants?: ProductVariant[];
}) {
  const { add, loading } = useCart();
  const choices = variants ?? product.variants;
  const [selectedId, setSelectedId] = useState(() => firstSellable(choices)?.id ?? "");
  const [added, setAdded] = useState(false);

  if (!product.availableForSale) {
    return <NotifyMe productName={product.title} />;
  }

  const selected = choices.find((v) => v.id === selectedId) ?? firstSellable(choices);
  if (!selected) return null;

  const label = variantLabel(selected.title);
  // `null` means the inventory scope is not granted — unknown, not zero.
  const stock = selected.quantityAvailable;
  const soldOut = !selected.availableForSale;
  const lowStock = stock !== null && stock > 0 && stock <= LOW_STOCK_THRESHOLD;

  const onAdd = async () => {
    await add(selected.id, 1);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
    toast.success(`${product.title}${label ? ` ${label}` : ""} added to cart`, {
      description: "Open the cart to check out.",
    });
  };

  return (
    <div className={compact ? "space-y-3" : "space-y-4"}>
      {choices.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {choices.map((v) => {
            const vLabel = variantLabel(v.title) || v.title;
            return (
              <button
                key={v.id}
                type="button"
                onClick={() => setSelectedId(v.id)}
                aria-pressed={selected.id === v.id}
                disabled={!v.availableForSale}
                className={`inline-flex min-h-10 items-center rounded-full border px-4 text-xs transition-colors disabled:cursor-not-allowed disabled:opacity-45 ${
                  selected.id === v.id
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-muted-foreground sm:hover:border-primary sm:hover:text-primary"
                }`}
              >
                {vLabel}
                {!v.availableForSale && " — sold out"}
              </button>
            );
          })}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={onAdd}
          disabled={soldOut || loading}
          className="inline-flex min-h-12 items-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors disabled:cursor-not-allowed disabled:opacity-55 sm:hover:bg-[color:var(--botanical-deep)]"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : added ? (
            <Check className="h-4 w-4" />
          ) : (
            <ShoppingBag className="h-4 w-4" />
          )}
          {soldOut ? "Out of stock" : added ? "Added to cart" : "Add to cart"}
        </button>
        <Link
          to="/cart"
          className="text-xs font-medium text-[color:var(--burgundy)] underline-offset-4 sm:hover:underline"
        >
          View cart
        </Link>
      </div>

      {lowStock && (
        <p className="text-xs text-[color:var(--burgundy)]">
          Only {stock} left{label ? ` in ${label}` : ""}.
        </p>
      )}
    </div>
  );
}

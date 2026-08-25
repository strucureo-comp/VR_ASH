import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ShoppingBag, Check } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "./CartProvider";
import type { Product } from "@/lib/products";

export function AddToCart({ product, compact = false }: { product: Product; compact?: boolean }) {
  const { add } = useCart();
  const [size, setSize] = useState(product.variants[0]?.size ?? "");
  const [added, setAdded] = useState(false);

  if (!product.available) {
    return (
      <span className="inline-flex items-center rounded-full border border-border px-5 py-2.5 text-xs text-muted-foreground">
        Coming soon
      </span>
    );
  }

  const onAdd = () => {
    add({ slug: product.slug, name: product.name, size });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
    toast.success(`${product.name} ${size} added to cart`, {
      description: "Open the cart to complete your order details.",
    });
  };

  return (
    <div className={compact ? "space-y-3" : "space-y-4"}>
      {product.variants.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {product.variants.map((v) => (
            <button
              key={v.size}
              type="button"
              onClick={() => setSize(v.size)}
              aria-pressed={size === v.size}
              className={`rounded-full border px-4 py-2 text-xs transition-colors ${
                size === v.size
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:border-primary hover:text-primary"
              }`}
            >
              {v.size}
            </button>
          ))}
        </div>
      )}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-[color:var(--botanical-deep)]"
        >
          {added ? <Check className="h-4 w-4" /> : <ShoppingBag className="h-4 w-4" />}
          {added ? "Added to cart" : "Add to cart"}
        </button>
        <Link
          to="/cart"
          className="text-xs font-medium text-[color:var(--burgundy)] underline-offset-4 hover:underline"
        >
          View cart
        </Link>
      </div>
    </div>
  );
}

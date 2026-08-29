import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";
import { toast } from "sonner";

import {
  cartAddLines,
  cartAttachCustomer,
  cartCreate,
  cartRemoveLines,
  cartUpdateLines,
  fetchCart,
} from "@/lib/shopify/api";
import type { Cart, CartResult } from "@/lib/shopify/types";

type CartContextValue = {
  /** `null` before the first line is added, or after checkout completes. */
  cart: Cart | null;
  count: number;
  /** True while a Shopify mutation is in flight. */
  loading: boolean;
  add: (merchandiseId: string, quantity?: number) => Promise<void>;
  setQty: (lineId: string, quantity: number) => Promise<void>;
  remove: (lineId: string) => Promise<void>;
  clear: () => void;
  /**
   * Attaches the signed-in customer to the cart, returning the checkout URL to
   * use afterwards — or `null` when there was nothing to attach.
   */
  attachCustomer: () => Promise<string | null>;
};

const CartContext = createContext<CartContextValue | null>(null);

/**
 * v2 stores a Shopify cart id; v1 stored a local array of line objects with no
 * prices in it. The key is versioned rather than reused because the old reader
 * cast whatever it found straight to `CartItem[]` without validating it.
 */
const STORAGE_KEY = "vr-cart-v2";
const LEGACY_STORAGE_KEY = "vr-cart-v1";

function readStoredCartId(): string | null {
  try {
    localStorage.removeItem(LEGACY_STORAGE_KEY);
    const id = localStorage.getItem(STORAGE_KEY);
    return id && id.startsWith("gid://shopify/Cart/") ? id : null;
  } catch {
    return null;
  }
}

function storeCartId(id: string | null) {
  try {
    if (id) localStorage.setItem(STORAGE_KEY, id);
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* storage unavailable (private mode, quota) — the cart still works in-memory */
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  /** Optimistic quantity per line id, so the stepper responds before Shopify does. */
  const [pendingQty, setPendingQty] = useState<Record<string, number>>({});
  const cartIdRef = useRef<string | null>(null);

  // Rehydrate from the stored id. Shopify is the source of truth for contents,
  // prices and availability, so nothing but the id is persisted locally.
  useEffect(() => {
    const stored = readStoredCartId();
    if (!stored) return;
    cartIdRef.current = stored;
    let cancelled = false;

    void (async () => {
      try {
        const existing = await fetchCart({ data: stored });
        if (cancelled) return;
        if (existing) {
          setCart(existing);
        } else {
          // Completed or expired carts return null — drop the stale id.
          cartIdRef.current = null;
          storeCartId(null);
        }
      } catch {
        if (!cancelled) setCart(null);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const applyResult = useCallback((result: CartResult): boolean => {
    for (const error of result.userErrors) {
      toast.error(error.message);
    }
    if (result.cart) {
      setCart(result.cart);
      cartIdRef.current = result.cart.id;
      storeCartId(result.cart.id);
    }
    return result.userErrors.length === 0;
  }, []);

  const run = useCallback(
    async (action: () => Promise<CartResult>) => {
      setLoading(true);
      try {
        applyResult(await action());
      } catch (error) {
        console.error(error);
        toast.error("We could not update your cart", {
          description: "Please check your connection and try again.",
        });
      } finally {
        setPendingQty({});
        setLoading(false);
      }
    },
    [applyResult],
  );

  const add = useCallback(
    async (merchandiseId: string, quantity = 1) => {
      const cartId = cartIdRef.current;
      await run(() =>
        cartId
          ? cartAddLines({ data: { cartId, lines: [{ merchandiseId, quantity }] } })
          : cartCreate({ data: { lines: [{ merchandiseId, quantity }] } }),
      );
    },
    [run],
  );

  const setQty = useCallback(
    async (lineId: string, quantity: number) => {
      const cartId = cartIdRef.current;
      if (!cartId) return;
      if (quantity <= 0) {
        setPendingQty((prev) => ({ ...prev, [lineId]: 0 }));
        await run(() => cartRemoveLines({ data: { cartId, lineIds: [lineId] } }));
        return;
      }
      const clamped = Math.min(99, quantity);
      setPendingQty((prev) => ({ ...prev, [lineId]: clamped }));
      await run(() =>
        cartUpdateLines({ data: { cartId, lines: [{ id: lineId, quantity: clamped }] } }),
      );
    },
    [run],
  );

  const remove = useCallback(
    async (lineId: string) => {
      const cartId = cartIdRef.current;
      if (!cartId) return;
      setPendingQty((prev) => ({ ...prev, [lineId]: 0 }));
      await run(() => cartRemoveLines({ data: { cartId, lineIds: [lineId] } }));
    },
    [run],
  );

  /**
   * Local reset only — used after the shopper returns from a completed checkout.
   * Shopify carts are not deleted; they simply stop resolving once ordered.
   */
  const clear = useCallback(() => {
    cartIdRef.current = null;
    storeCartId(null);
    setPendingQty({});
    setCart(null);
  }, []);

  /**
   * Called just before checkout rather than at sign-in, because the cart id lives
   * in this browser and `/account/callback` — a server handler — cannot see it.
   *
   * Failure is deliberately silent: a guest checkout is still a valid checkout,
   * so a problem here must not stop the shopper from paying.
   */
  const attachCustomer = useCallback(async (): Promise<string | null> => {
    const cartId = cartIdRef.current;
    if (!cartId) return null;
    try {
      const result = await cartAttachCustomer({ data: { cartId } });
      if (!result?.cart) return null;
      setCart(result.cart);
      return result.cart.checkoutUrl;
    } catch (error) {
      console.error(error);
      return null;
    }
  }, []);

  const value = useMemo<CartContextValue>(() => {
    const optimisticCart: Cart | null =
      cart && Object.keys(pendingQty).length > 0
        ? {
            ...cart,
            lines: cart.lines
              .map((line) => ({ ...line, quantity: pendingQty[line.id] ?? line.quantity }))
              .filter((line) => line.quantity > 0),
          }
        : cart;

    return {
      cart: optimisticCart,
      count: optimisticCart?.lines.reduce((n, line) => n + line.quantity, 0) ?? 0,
      loading,
      add,
      setQty,
      remove,
      clear,
      attachCustomer,
    };
  }, [cart, pendingQty, loading, add, setQty, remove, clear, attachCustomer]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

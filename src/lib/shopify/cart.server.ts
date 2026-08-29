import { storefront } from "./client.server";
import { toCart, toCartResult, type RawCart, type RawCartMutation } from "./map";
import {
  CART_BUYER_IDENTITY_MUTATION,
  CART_CREATE_MUTATION,
  CART_LINES_ADD_MUTATION,
  CART_LINES_REMOVE_MUTATION,
  CART_LINES_UPDATE_MUTATION,
  CART_QUERY,
} from "./queries";
import type { Cart, CartResult } from "./types";

/**
 * Shopify Cart API. The cart is the system of record for quantities and money —
 * nothing here recomputes a total, and checkout is Shopify's hosted flow reached
 * through `cart.checkoutUrl`.
 */

export type CartLineInput = { merchandiseId: string; quantity: number };
export type BuyerIdentityInput = {
  customerAccessToken?: string;
  email?: string;
  countryCode?: string;
};

/** `null` when the id is unknown or the cart has been completed/expired. */
export async function getCart(cartId: string): Promise<Cart | null> {
  const data = await storefront<{ cart: RawCart | null }>(CART_QUERY, { id: cartId });
  return data.cart ? toCart(data.cart) : null;
}

export async function createCart(
  lines: CartLineInput[] = [],
  buyerIdentity?: BuyerIdentityInput,
): Promise<CartResult> {
  const data = await storefront<{ cartCreate: RawCartMutation | null }>(CART_CREATE_MUTATION, {
    lines,
    buyerIdentity: buyerIdentity ?? null,
  });
  return toCartResult(data.cartCreate);
}

export async function addCartLines(cartId: string, lines: CartLineInput[]): Promise<CartResult> {
  const data = await storefront<{ cartLinesAdd: RawCartMutation | null }>(CART_LINES_ADD_MUTATION, {
    cartId,
    lines,
  });
  return toCartResult(data.cartLinesAdd);
}

export async function updateCartLines(
  cartId: string,
  lines: Array<{ id: string; quantity: number }>,
): Promise<CartResult> {
  const data = await storefront<{ cartLinesUpdate: RawCartMutation | null }>(
    CART_LINES_UPDATE_MUTATION,
    { cartId, lines },
  );
  return toCartResult(data.cartLinesUpdate);
}

export async function removeCartLines(cartId: string, lineIds: string[]): Promise<CartResult> {
  const data = await storefront<{ cartLinesRemove: RawCartMutation | null }>(
    CART_LINES_REMOVE_MUTATION,
    { cartId, lineIds },
  );
  return toCartResult(data.cartLinesRemove);
}

/**
 * Attaches a signed-in customer to the cart so the hosted checkout is
 * pre-filled and the resulting order lands in their order history.
 */
export async function setCartBuyerIdentity(
  cartId: string,
  buyerIdentity: BuyerIdentityInput,
): Promise<CartResult> {
  const data = await storefront<{ cartBuyerIdentityUpdate: RawCartMutation | null }>(
    CART_BUYER_IDENTITY_MUTATION,
    { cartId, buyerIdentity },
  );
  return toCartResult(data.cartBuyerIdentityUpdate);
}

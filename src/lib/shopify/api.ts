import { createServerFn } from "@tanstack/react-start";
import { getRequest, setResponseHeader } from "@tanstack/react-start/server";
import { z } from "zod";

import {
  createAccountAddress,
  deleteAccountAddress,
  getAccountAddresses,
  getAccountOrder,
  getAccountOrders,
  getAccountProfile,
  updateAccountAddress,
} from "./account.server";
import { resolveSession } from "./auth.server";
import {
  addCartLines,
  createCart,
  getCart,
  removeCartLines,
  setCartBuyerIdentity,
  updateCartLines,
} from "./cart.server";
import {
  getCollectionProducts,
  getFeaturedProducts,
  getProduct,
  getProducts,
} from "./catalog.server";
import type { AddressInput } from "./types";

/**
 * The only framework-coupled file in `src/lib/shopify/`. Everything it calls is a
 * plain async function, so migrating to Next.js means replacing these wrappers
 * with route handlers / server actions and touching nothing else.
 *
 * Server functions are used rather than importing `*.server.ts` into routes
 * directly because TanStack Start runs loaders on the client during navigation —
 * a direct import would pull the Storefront token into the browser bundle.
 */

const gid = z.string().min(1).startsWith("gid://shopify/");

export const fetchProducts = createServerFn({ method: "GET" })
  .validator(z.object({ first: z.number().int().min(1).max(100) }))
  .handler(async ({ data }) => getProducts({ first: data.first }));

export const fetchProduct = createServerFn({ method: "GET" })
  .validator(z.string().min(1).max(255))
  .handler(async ({ data }) => getProduct(data));

export const fetchFeaturedProducts = createServerFn({ method: "GET" })
  .validator(z.object({ first: z.number().int().min(1).max(50) }))
  .handler(async ({ data }) => getFeaturedProducts(data.first));

export const fetchCollection = createServerFn({ method: "GET" })
  .validator(
    z.object({ handle: z.string().min(1).max(255), first: z.number().int().min(1).max(100) }),
  )
  .handler(async ({ data }) => getCollectionProducts(data.handle, data.first));

/* ---------------------------------- cart ---------------------------------- */

const lineInput = z.object({ merchandiseId: gid, quantity: z.number().int().min(1).max(99) });

export const fetchCart = createServerFn({ method: "GET" })
  .validator(gid)
  .handler(async ({ data }) => getCart(data));

export const cartCreate = createServerFn({ method: "POST" })
  .validator(z.object({ lines: z.array(lineInput).max(50) }))
  .handler(async ({ data }) => createCart(data.lines));

export const cartAddLines = createServerFn({ method: "POST" })
  .validator(z.object({ cartId: gid, lines: z.array(lineInput).min(1).max(50) }))
  .handler(async ({ data }) => addCartLines(data.cartId, data.lines));

export const cartUpdateLines = createServerFn({ method: "POST" })
  .validator(
    z.object({
      cartId: gid,
      lines: z
        .array(z.object({ id: gid, quantity: z.number().int().min(0).max(99) }))
        .min(1)
        .max(50),
    }),
  )
  .handler(async ({ data }) => updateCartLines(data.cartId, data.lines));

export const cartRemoveLines = createServerFn({ method: "POST" })
  .validator(z.object({ cartId: gid, lineIds: z.array(gid).min(1).max(50) }))
  .handler(async ({ data }) => removeCartLines(data.cartId, data.lineIds));

export const cartAttachBuyer = createServerFn({ method: "POST" })
  .validator(z.object({ cartId: gid, email: z.string().email().max(255) }))
  .handler(async ({ data }) => setCartBuyerIdentity(data.cartId, { email: data.email }));

/* -------------------------------- account --------------------------------- */

/**
 * The live customer access token for this request, renewed if it had expired.
 * `null` means "not signed in" — callers return `null` up to the route rather
 * than throwing, so the page can render a sign-in prompt instead of an error.
 *
 * Every authenticated server function goes through here rather than calling
 * `resolveSession` itself, because a renewed token has to be written back to the
 * browser and this is the one place that does it.
 */
async function accessToken(): Promise<string | null> {
  const resolved = await resolveSession(getRequest().headers.get("cookie"));
  if (resolved.cookie) setResponseHeader("set-cookie", resolved.cookie);
  return resolved.session?.accessToken ?? null;
}

/**
 * Links the signed-in shopper to their cart, so Shopify's hosted checkout opens
 * pre-filled and the resulting order appears under `/account/orders`.
 *
 * The token is read from the session cookie and never accepted from the caller —
 * a client-supplied token would let anyone attach someone else's account to a
 * cart. `null` means nobody is signed in, which is not an error: the shopper
 * simply checks out as a guest.
 */
export const cartAttachCustomer = createServerFn({ method: "POST" })
  .validator(z.object({ cartId: gid }))
  .handler(async ({ data }) => {
    const token = await accessToken();
    if (!token) return null;
    return setCartBuyerIdentity(data.cartId, { customerAccessToken: token });
  });

export const fetchAccount = createServerFn({ method: "GET" }).handler(async () => {
  const token = await accessToken();
  return token ? getAccountProfile(token) : null;
});

export const fetchAddresses = createServerFn({ method: "GET" }).handler(async () => {
  const token = await accessToken();
  return token ? getAccountAddresses(token) : null;
});

export const fetchOrders = createServerFn({ method: "GET" })
  .validator(z.object({ first: z.number().int().min(1).max(50) }))
  .handler(async ({ data }) => {
    const token = await accessToken();
    return token ? getAccountOrders(token, data.first) : null;
  });

/**
 * Outer `null` means not signed in; `{ order: null }` means signed in but that
 * order is not this customer's. The two need different pages, so they cannot
 * collapse into one value.
 */
export const fetchOrder = createServerFn({ method: "GET" })
  .validator(z.string().min(1).startsWith("gid://shopify/Order/"))
  .handler(async ({ data }) => {
    const token = await accessToken();
    if (!token) return null;
    return { order: await getAccountOrder(token, data) };
  });

const addressInput = z.object({
  firstName: z.string().trim().max(120).optional(),
  lastName: z.string().trim().max(120).optional(),
  company: z.string().trim().max(120).optional(),
  address1: z.string().trim().max(255).optional(),
  address2: z.string().trim().max(255).optional(),
  city: z.string().trim().max(120).optional(),
  /** Province/state code, e.g. `TN`. Shopify rejects full names here. */
  zoneCode: z.string().trim().max(10).optional(),
  /** ISO 3166-1 alpha-2, e.g. `IN`. */
  territoryCode: z.string().trim().length(2).optional(),
  zip: z.string().trim().max(20).optional(),
  phoneNumber: z.string().trim().max(40).optional(),
});

const addressId = z.string().min(1).startsWith("gid://shopify/CustomerAddress/");

/**
 * zod types an omitted `.optional()` field as `string | undefined`, which
 * `exactOptionalPropertyTypes` will not accept where `AddressInput` declares the
 * property absent. Dropping the undefined keys reconciles the two, and keeps
 * `{"firstName": null}` out of the GraphQL variables at the same time.
 */
function toAddressInput(data: z.infer<typeof addressInput>): AddressInput {
  const input: AddressInput = {};
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) input[key as keyof AddressInput] = value;
  }
  return input;
}

export const accountAddressCreate = createServerFn({ method: "POST" })
  .validator(z.object({ address: addressInput, makeDefault: z.boolean() }))
  .handler(async ({ data }) => {
    const token = await accessToken();
    if (!token) return null;
    return createAccountAddress(token, toAddressInput(data.address), data.makeDefault);
  });

export const accountAddressUpdate = createServerFn({ method: "POST" })
  .validator(z.object({ id: addressId, address: addressInput, makeDefault: z.boolean() }))
  .handler(async ({ data }) => {
    const token = await accessToken();
    if (!token) return null;
    return updateAccountAddress(token, data.id, toAddressInput(data.address), data.makeDefault);
  });

export const accountAddressDelete = createServerFn({ method: "POST" })
  .validator(z.object({ id: addressId }))
  .handler(async ({ data }) => {
    const token = await accessToken();
    if (!token) return null;
    return deleteAccountAddress(token, data.id);
  });

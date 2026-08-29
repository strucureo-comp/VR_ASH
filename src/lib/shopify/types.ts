/**
 * View models the UI renders. Deliberately not the raw Storefront API shapes —
 * mapping happens once in `map.ts` so components never walk `edges[].node`.
 *
 * Nullable fields are typed `T | null` rather than `field?: T`: the project sets
 * `exactOptionalPropertyTypes: true`, which makes "present but null" and
 * "absent" incompatible, and GraphQL always sends the key.
 */

export type Money = {
  amount: number;
  currencyCode: string;
};

export type ProductImage = {
  url: string;
  altText: string | null;
  width: number | null;
  height: number | null;
};

export type ProductVariant = {
  /** `gid://shopify/ProductVariant/…` — the id the Cart API needs. */
  id: string;
  title: string;
  sku: string | null;
  price: Money;
  compareAtPrice: Money | null;
  availableForSale: boolean;
  /**
   * `null` when the app lacks `unauthenticated_read_product_inventory`, which
   * is different from `0`. Treat null as "unknown", never as "out of stock".
   */
  quantityAvailable: number | null;
  image: ProductImage | null;
  selectedOptions: Array<{ name: string; value: string }>;
};

export type Product = {
  id: string;
  handle: string;
  title: string;
  /** Plain-text description, safe to render as-is. */
  description: string;
  descriptionHtml: string;
  vendor: string;
  productType: string;
  tags: string[];
  featuredImage: ProductImage | null;
  images: ProductImage[];
  variants: ProductVariant[];
  priceRange: { min: Money; max: Money };
  availableForSale: boolean;
  totalInventory: number | null;
  seoTitle: string | null;
  seoDescription: string | null;
};

export type CartLine = {
  /** `gid://shopify/CartLine/…` — needed to update or remove the line. */
  id: string;
  quantity: number;
  merchandiseId: string;
  productHandle: string;
  productTitle: string;
  variantTitle: string;
  image: ProductImage | null;
  unitPrice: Money;
  lineTotal: Money;
  availableForSale: boolean;
  quantityAvailable: number | null;
};

export type Cart = {
  id: string;
  /** Shopify-hosted checkout. Never rebuild the forms behind this. */
  checkoutUrl: string;
  totalQuantity: number;
  subtotal: Money;
  total: Money;
  tax: Money | null;
  lines: CartLine[];
};

/** A `cartUserErrors` entry, surfaced to the shopper rather than thrown. */
export type CartUserError = {
  field: string[] | null;
  message: string;
  code: string | null;
};

export type CartResult = {
  cart: Cart | null;
  userErrors: CartUserError[];
};

/* --------------------------- customer accounts ---------------------------- */
/**
 * These come from the Customer Account API, which is a different schema from the
 * Storefront API above — hence the separate documents in `customerQueries.ts`.
 * The view models stay in this file anyway so components import types from one
 * place, and so nothing client-side has to know which API a page reads from.
 */

export type Address = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  company: string | null;
  address1: string | null;
  address2: string | null;
  city: string | null;
  /** Province/state code, e.g. `TN`. */
  zoneCode: string | null;
  /** ISO country code, e.g. `IN`. */
  territoryCode: string | null;
  zip: string | null;
  phone: string | null;
  /** Shopify's own locale-aware rendering — render these lines rather than
   * assembling an address by hand, which gets the field order wrong per country. */
  formatted: string[];
  isDefault: boolean;
};

export type AccountProfile = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  /** Shopify's own fallback — the email when no name is set, never empty. */
  displayName: string;
  email: string | null;
  phone: string | null;
  defaultAddress: Address | null;
};

export type OrderSummary = {
  id: string;
  /** Human-facing order name, e.g. `#1001`. */
  name: string;
  /** ISO timestamp. Formatting is the component's job. */
  processedAt: string;
  /** `null` until Shopify settles the payment status. */
  financialStatus: string | null;
  fulfillmentStatus: string;
  total: Money;
  /** Shopify-hosted status and tracking page for this order. */
  statusPageUrl: string | null;
};

export type OrderLine = {
  title: string;
  variantTitle: string | null;
  quantity: number;
  image: ProductImage | null;
  total: Money | null;
};

export type OrderDetail = OrderSummary & {
  subtotal: Money | null;
  shipping: Money | null;
  tax: Money | null;
  lines: OrderLine[];
  shippingAddress: Address | null;
};

/** A `userErrors` entry from an address mutation, shown next to the form. */
export type AccountUserError = {
  field: string[] | null;
  message: string;
  code: string | null;
};

/**
 * What the address form sends. Every field is optional because Shopify decides
 * which ones a given country requires and reports the rest through `userErrors`
 * — duplicating those rules here would go stale the moment a country is added.
 */
export type AddressInput = {
  firstName?: string;
  lastName?: string;
  company?: string;
  address1?: string;
  address2?: string;
  city?: string;
  zoneCode?: string;
  territoryCode?: string;
  zip?: string;
  phoneNumber?: string;
};

export type AddressResult = {
  address: Address | null;
  userErrors: AccountUserError[];
};

import type { Money, Product } from "./types";

/**
 * Money formatting for the UI. Client-safe (no server imports) so components can
 * use it directly. Amounts always come from Shopify already computed — nothing
 * here does arithmetic on prices.
 */
export function formatMoney(money: Money): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: money.currencyCode,
    maximumFractionDigits: Number.isInteger(money.amount) ? 0 : 2,
  }).format(money.amount);
}

/** "₹500" for a single price, "₹500 – ₹900" when variants differ. */
export function priceRangeLabel(product: Product): string {
  const { min, max } = product.priceRange;
  if (min.amount === max.amount) return formatMoney(min);
  return `${formatMoney(min)} – ${formatMoney(max)}`;
}

/**
 * Shopify names a variant "Default Title" when a product has no real options.
 * Showing that to a shopper looks like a bug, so it collapses to "".
 */
export function variantLabel(title: string): string {
  return title === "Default Title" ? "" : title;
}

export function productSubtitle(product: Product): string {
  const type = product.productType?.trim();
  if (type) return type;
  if (isSolidermaHandle(product.handle)) return "Ayurvedic Wound Care";
  return product.tags?.[0]?.trim() || "Ayurvedic Medicine";
}

/**
 * Asks Shopify's CDN for a resized copy. Product images are uploaded at full
 * resolution, so serving them unresized costs a phone several megabytes.
 */
export function sizedImage(url: string, width: number): string {
  try {
    const parsed = new URL(url);
    parsed.searchParams.set("width", String(width));
    return parsed.toString();
  } catch {
    return url;
  }
}

/**
 * Alt text, with a fallback. Shopify leaves `altText` null unless a merchant
 * fills it in, and an empty alt on a product image fails accessibility review.
 */
export function imageAlt(altText: string | null, product: Product): string {
  const provided = altText?.trim();
  if (provided) return provided;
  const type = product.productType.trim();
  return type ? `${product.title} — ${type}` : product.title;
}

/**
 * Soliderma has its own long-form route, so both the redirect and that route
 * need to recognise its product.
 *
 * The handle in Shopify is currently `soliderma™` — the trademark symbol was
 * kept when the product was created, which produces the unreadable URL
 * `/products/soliderma%E2%84%A2`. It should be renamed to `soliderma` in Admin;
 * matching on the alphanumeric stem keeps the flagship page working before and
 * after that rename.
 */
export function isSolidermaHandle(handle: string): boolean {
  return handle.replace(/[^a-z0-9]/gi, "").toLowerCase() === "soliderma";
}

/**
 * Order timestamps arrive as ISO strings in UTC. Rendered in the store's own
 * locale rather than the browser's so a shopper and support see the same date
 * when they compare notes.
 */
export function formatOrderDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  }).format(date);
}

/**
 * Shopify's status enums are SCREAMING_SNAKE_CASE. Shown raw they read like a
 * database dump, and hard-coding a lookup would silently fall back to nothing
 * when Shopify adds a value, so the enum is reshaped rather than mapped.
 */
export function statusLabel(value: string | null): string {
  if (!value) return "";
  const words = value.toLowerCase().replace(/_/g, " ");
  return words.charAt(0).toUpperCase() + words.slice(1);
}

/**
 * Order ids are GIDs (`gid://shopify/Order/123`) and the slashes cannot go in a
 * path segment, so the tail after the last slash is the route param. Kept as a
 * pair with `orderGid` so the two can never drift apart.
 */
export function orderPathId(gid: string): string {
  return gid.split("/").pop() ?? gid;
}

export function orderGid(pathId: string): string {
  return `gid://shopify/Order/${pathId}`;
}

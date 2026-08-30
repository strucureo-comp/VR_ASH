/**
 * Turns a Shopify product GID into the key its extra content is stored under.
 *
 * The numeric id, not the handle: a handle can be renamed in Shopify Admin (this
 * store's `soliderma™` still has to become `soliderma`) and a rename must not
 * orphan everything written about the product.
 */
export function contentId(productGid: string): string {
  const tail = productGid.split("/").pop() ?? "";
  return tail.trim();
}

export function productContentPath(productGid: string): string {
  return `content/products/${contentId(productGid)}`;
}

export const SHARED_CONTENT_PATH = "content/shared";
export const ENQUIRIES_PATH = "enquiries";

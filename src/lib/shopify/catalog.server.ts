import { storefront } from "./client.server";
import { toProduct, type RawProduct } from "./map";
import { COLLECTION_PRODUCTS_QUERY, PRODUCT_QUERY, PRODUCTS_QUERY } from "./queries";
import type { Product } from "./types";

/**
 * Catalogue reads. Plain async functions with no framework imports, so the port
 * to Next.js reuses this file unchanged and only the server-function wrappers in
 * `api.ts` get rewritten.
 */

export type ProductSortKey = "BEST_SELLING" | "CREATED_AT" | "PRICE" | "TITLE" | "UPDATED_AT";

export async function getProducts(
  options: { first?: number; sortKey?: ProductSortKey; reverse?: boolean } = {},
): Promise<Product[]> {
  const data = await storefront<{ products: { nodes: RawProduct[] } }>(PRODUCTS_QUERY, {
    first: options.first ?? 24,
    sortKey: options.sortKey ?? "TITLE",
    reverse: options.reverse ?? false,
  });
  return data.products.nodes.map(toProduct);
}

export async function getProduct(handle: string): Promise<Product | null> {
  const data = await storefront<{ product: RawProduct | null }>(PRODUCT_QUERY, { handle });
  return data.product ? toProduct(data.product) : null;
}

export type CollectionWithProducts = {
  handle: string;
  title: string;
  description: string;
  products: Product[];
};

export async function getCollectionProducts(
  handle: string,
  first = 12,
): Promise<CollectionWithProducts | null> {
  const data = await storefront<{
    collection: {
      handle: string;
      title: string;
      description: string;
      products: { nodes: RawProduct[] };
    } | null;
  }>(COLLECTION_PRODUCTS_QUERY, { handle, first });

  const collection = data.collection;
  if (!collection) return null;
  return {
    handle: collection.handle,
    title: collection.title,
    description: collection.description,
    products: collection.products.nodes.map(toProduct),
  };
}

/**
 * Products for the home-page range grid. Shopify's built-in `frontpage`
 * collection is the store's "Home page" collection, so merchandising the home
 * page is a drag-and-drop job in Admin rather than a code change — which is what
 * §29 asks for. Falls back to the newest products if that collection is empty.
 */
export async function getFeaturedProducts(first = 6): Promise<Product[]> {
  const collection = await getCollectionProducts("frontpage", first);
  if (collection && collection.products.length > 0) return collection.products;
  return getProducts({ first, sortKey: "CREATED_AT", reverse: true });
}

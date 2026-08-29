import { queryOptions } from "@tanstack/react-query";

import {
  fetchAccount,
  fetchAddresses,
  fetchCollection,
  fetchFeaturedProducts,
  fetchOrder,
  fetchOrders,
  fetchProduct,
  fetchProducts,
} from "./api";

/**
 * Route loaders call these through `queryClient.ensureQueryData` so a navigation
 * back to a page it has already seen renders from cache. The router sets
 * `defaultPreloadStaleTime: 0`, which disables its own loader cache, so
 * react-query is where caching actually happens.
 */

const CATALOGUE_STALE_TIME = 5 * 60 * 1000;

export const productsQuery = (first = 24) =>
  queryOptions({
    queryKey: ["shopify", "products", first],
    queryFn: () => fetchProducts({ data: { first } }),
    staleTime: CATALOGUE_STALE_TIME,
  });

export const productQuery = (handle: string) =>
  queryOptions({
    queryKey: ["shopify", "product", handle],
    queryFn: () => fetchProduct({ data: handle }),
    staleTime: CATALOGUE_STALE_TIME,
  });

export const featuredProductsQuery = (first = 6) =>
  queryOptions({
    queryKey: ["shopify", "featured", first],
    queryFn: () => fetchFeaturedProducts({ data: { first } }),
    staleTime: CATALOGUE_STALE_TIME,
  });

export const collectionQuery = (handle: string, first = 24) =>
  queryOptions({
    queryKey: ["shopify", "collection", handle, first],
    queryFn: () => fetchCollection({ data: { handle, first } }),
    staleTime: CATALOGUE_STALE_TIME,
  });

/**
 * Account reads are kept short-lived: an order's fulfilment status can change
 * while the tab is open, and a stale profile is more confusing than a second
 * request. Signing in or out is a full page load, so a fresh cache comes with it
 * and nothing has to be invalidated by hand.
 */
const ACCOUNT_STALE_TIME = 30 * 1000;

export const accountQuery = () =>
  queryOptions({
    queryKey: ["shopify", "account"],
    queryFn: () => fetchAccount(),
    staleTime: ACCOUNT_STALE_TIME,
  });

export const addressesQuery = () =>
  queryOptions({
    queryKey: ["shopify", "addresses"],
    queryFn: () => fetchAddresses(),
    staleTime: ACCOUNT_STALE_TIME,
  });

export const ordersQuery = (first = 20) =>
  queryOptions({
    queryKey: ["shopify", "orders", first],
    queryFn: () => fetchOrders({ data: { first } }),
    staleTime: ACCOUNT_STALE_TIME,
  });

export const orderQuery = (id: string) =>
  queryOptions({
    queryKey: ["shopify", "order", id],
    queryFn: () => fetchOrder({ data: id }),
    staleTime: ACCOUNT_STALE_TIME,
  });

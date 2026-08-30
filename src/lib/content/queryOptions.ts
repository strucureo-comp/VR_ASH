import { queryOptions } from "@tanstack/react-query";

import {
  fetchContentIndex,
  fetchFirebaseConfig,
  fetchProductContent,
  fetchSharedContent,
} from "./api";

/**
 * Loaders call these through `queryClient.ensureQueryData`, the same way the
 * Shopify reads work — the router sets `defaultPreloadStaleTime: 0`, so
 * react-query is where caching actually happens.
 *
 * Same stale time as the catalogue: this content changes when someone edits it in
 * the admin panel, which is rarer than a price change.
 */
const CONTENT_STALE_TIME = 5 * 60 * 1000;

export const productContentQuery = (contentId: string) =>
  queryOptions({
    queryKey: ["content", "product", contentId],
    queryFn: () => fetchProductContent({ data: contentId }),
    staleTime: CONTENT_STALE_TIME,
  });

export const sharedContentQuery = () =>
  queryOptions({
    queryKey: ["content", "shared"],
    queryFn: () => fetchSharedContent(),
    staleTime: CONTENT_STALE_TIME,
  });

/** The config never changes at runtime, so it is fetched once per page load. */
export const firebaseConfigQuery = () =>
  queryOptions({
    queryKey: ["content", "firebase-config"],
    queryFn: () => fetchFirebaseConfig(),
    staleTime: Infinity,
  });

/**
 * Admin-only, and deliberately short-lived: it answers "which products still have
 * no content?", which changes every time someone saves in the editor.
 */
export const contentIndexQuery = () =>
  queryOptions({
    queryKey: ["content", "index"],
    queryFn: () => fetchContentIndex(),
    staleTime: 0,
  });

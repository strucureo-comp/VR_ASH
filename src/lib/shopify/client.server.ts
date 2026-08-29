import { storefrontConfig } from "./env.server";

export type ShopifyGraphQLError = {
  message: string;
  path?: Array<string | number> | null;
  extensions?: { code?: string | null } | null;
};

type GraphQLResponse<T> = {
  data?: T | null;
  errors?: ShopifyGraphQLError[] | null;
};

export class ShopifyRequestError extends Error {
  readonly status: number;
  readonly graphQLErrors: ShopifyGraphQLError[];

  constructor(message: string, status: number, graphQLErrors: ShopifyGraphQLError[] = []) {
    super(message);
    this.name = "ShopifyRequestError";
    this.status = status;
    this.graphQLErrors = graphQLErrors;
  }
}

const TIMEOUT_MS = 10_000;

/**
 * Single entry point for every Storefront API call.
 *
 * Partial responses are deliberately tolerated: Shopify answers a query touching
 * a field the app is not scoped for (`quantityAvailable` without
 * `unauthenticated_read_product_inventory`) with `ACCESS_DENIED` in `errors` yet
 * still returns usable `data`. Throwing there would take the whole catalogue
 * down over an optional field, so the errors are logged and the data returned.
 * A response with no `data` at all is a real failure and throws.
 */
export async function storefront<T>(
  query: string,
  variables: Record<string, unknown> = {},
): Promise<T> {
  const { endpoint, token } = storefrontConfig();

  let response: Response;
  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": token,
      },
      body: JSON.stringify({ query, variables }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch (cause) {
    const reason = cause instanceof Error ? cause.message : "unknown error";
    throw new ShopifyRequestError(`Could not reach Shopify: ${reason}`, 503);
  }

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new ShopifyRequestError(
      `Shopify returned ${response.status} ${response.statusText}. ${body.slice(0, 400)}`,
      response.status,
    );
  }

  const payload = (await response.json()) as GraphQLResponse<T>;
  const errors = payload.errors ?? [];

  if (payload.data == null) {
    const detail = errors.map((e) => e.message).join("; ") || "no data returned";
    throw new ShopifyRequestError(`Shopify query failed: ${detail}`, 502, errors);
  }

  if (errors.length > 0) {
    console.warn(
      "[shopify] partial response:",
      errors.map(
        (e) => `${e.extensions?.code ?? "ERROR"} at ${e.path?.join(".") ?? "?"}: ${e.message}`,
      ),
    );
  }

  return payload.data;
}

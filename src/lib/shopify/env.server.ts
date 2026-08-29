/**
 * Server-only Shopify configuration.
 *
 * None of these names carry a `VITE_` prefix on purpose: the Lovable vite config
 * top-level-`define`s every `VITE_*` variable into the client bundle as well as
 * the server one, so a prefixed secret would be published to the browser.
 *
 * Read through the accessor functions rather than `process.env` directly — they
 * fail with an actionable message instead of sending an unauthenticated request
 * to Shopify and reporting a confusing 401.
 */

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing ${name}. Copy .env.example to .env.local and fill it in — the Storefront token comes from Shopify Admin → Settings → Apps and sales channels → Develop apps → your app → API credentials.`,
    );
  }
  return value;
}

export type StorefrontConfig = {
  domain: string;
  apiVersion: string;
  token: string;
  endpoint: string;
};

export function storefrontConfig(): StorefrontConfig {
  const domain = required("SHOPIFY_STORE_DOMAIN");
  const apiVersion = process.env["SHOPIFY_STOREFRONT_API_VERSION"] ?? "2026-07";
  return {
    domain,
    apiVersion,
    token: required("SHOPIFY_STOREFRONT_TOKEN"),
    endpoint: `https://${domain}/api/${apiVersion}/graphql.json`,
  };
}

export type CustomerAccountConfig = {
  shopId: string;
  clientId: string;
  /**
   * Only set for a "Confidential" Headless client. `null` means the client is
   * "Public" and authenticates with PKCE alone.
   */
  clientSecret: string | null;
  apiVersion: string;
  /** OIDC issuer — authorize/token/logout all hang off this. */
  issuer: string;
  apiEndpoint: string;
};

/**
 * Customer Account API config. Returns `null` until the Headless channel is
 * installed and `SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID` is set, so the rest of the
 * site keeps working while login is still unconfigured.
 *
 * Both URLs below are the ones this store actually advertises — confirmed
 * against `/.well-known/openid-configuration` and
 * `/.well-known/customer-account-api` on the shop domain, which are the
 * authoritative source if Shopify ever moves them.
 */
export function customerAccountConfig(): CustomerAccountConfig | null {
  const shopId = process.env["SHOPIFY_SHOP_ID"];
  const clientId = process.env["SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID"];
  if (!shopId || !clientId) return null;

  const apiVersion = process.env["SHOPIFY_CUSTOMER_ACCOUNT_API_VERSION"] ?? "2026-07";
  return {
    shopId,
    clientId,
    clientSecret: process.env["SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_SECRET"] ?? null,
    apiVersion,
    issuer: `https://shopify.com/authentication/${shopId}`,
    apiEndpoint: `https://shopify.com/${shopId}/account/customer/api/${apiVersion}/graphql`,
  };
}

/** Absolute origin of this site, used to build OAuth redirect URIs. */
export function siteOrigin(): string {
  const explicit = process.env["SITE_ORIGIN"];
  if (explicit) return explicit.replace(/\/$/, "");
  const vercel = process.env["VERCEL_PROJECT_PRODUCTION_URL"] ?? process.env["VERCEL_URL"];
  if (vercel) return `https://${vercel}`;
  return "http://localhost:8080";
}

export function sessionSecret(): string {
  return required("SESSION_SECRET");
}

import "@shopify/ui-extensions/preact";
import { render } from "preact";

/**
 * A block on Shopify's thank-you page that sends the shopper to their order
 * history on our own storefront.
 *
 * It is a link the shopper taps, not a redirect, because Shopify permits no
 * automatic navigation away from its hosted checkout on any plan: extensions run
 * in a Web Worker with no `window`, and the sunset of `checkout.liquid` and the
 * Additional scripts box closed the historical workarounds. A prominent block is
 * the whole of what is available.
 */

/** Used until a merchant fills in the URL field in the checkout editor. */
const DEFAULT_ORDERS_URL = "https://vr-ash.vercel.app/account/orders";

export default async () => {
  render(<Extension />, document.body);
};

function Extension() {
  const configured = shopify.settings.value?.["storefront_orders_url"];
  const base =
    typeof configured === "string" && configured.trim() ? configured.trim() : DEFAULT_ORDERS_URL;

  // `ordered=1` tells the storefront that this arrival follows a completed
  // checkout, so it confirms the order and clears the local cart. A signed-out
  // shopper gets the confirmation plus a prompt to sign in with the same email.
  const href = `${base}${base.includes("?") ? "&" : "?"}ordered=1`;

  return (
    <s-section heading={shopify.i18n.translate("heading")}>
      <s-stack gap="base">
        <s-paragraph>{shopify.i18n.translate("body")}</s-paragraph>
        <s-button href={href} variant="primary">
          {shopify.i18n.translate("action")}
        </s-button>
      </s-stack>
    </s-section>
  );
}

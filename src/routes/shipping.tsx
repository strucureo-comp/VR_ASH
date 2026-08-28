import { createFileRoute } from "@tanstack/react-router";
import { PolicyPage } from "@/components/site/PolicyPage";
import { PHONE_DISPLAY } from "@/lib/site";

export const Route = createFileRoute("/shipping")({
  head: () => ({
    meta: [
      { title: "Shipping & Returns | Vallalaar Remedies" },
      {
        name: "description",
        content:
          "Dispatch timelines, delivery coverage and the returns process for Soliderma orders from Vallalaar Remedies.",
      },
    ],
  }),
  component: Shipping,
});

function Shipping() {
  return (
    <PolicyPage
      eyebrow="Support"
      title="Shipping & Returns"
      intro="How orders are dispatched, how long delivery takes, and what to do if something arrives damaged."
      updated="August 2026"
      sections={[
        {
          heading: "Order confirmation",
          body: (
            <p>
              Orders are placed through the cart and confirmed over WhatsApp on {PHONE_DISPLAY}. Our
              team confirms the item, size, quantity and delivery address before dispatch.
            </p>
          ),
        },
        {
          heading: "Dispatch and delivery",
          body: (
            <p>
              Confirmed orders are dispatched from Chennai within 1–2 working days. Delivery
              timelines depend on the destination and courier partner; our team shares the expected
              window and tracking details once the parcel is handed over.
            </p>
          ),
        },
        {
          heading: "Damaged or incorrect items",
          body: (
            <p>
              If a bottle arrives damaged, leaking or is not the item you ordered, contact us within
              48 hours of delivery with photographs of the parcel and product. We arrange a
              replacement for verified cases.
            </p>
          ),
        },
        {
          heading: "Returns",
          body: (
            <p>
              For hygiene and product-safety reasons, opened or used bottles cannot be returned.
              Unopened items in their original packaging may be returned by prior arrangement with
              our team.
            </p>
          ),
        },
        {
          heading: "Questions",
          body: (
            <p>
              Message or call {PHONE_DISPLAY} for anything relating to an existing order, and our
              team will respond during business hours.
            </p>
          ),
        },
      ]}
    />
  );
}

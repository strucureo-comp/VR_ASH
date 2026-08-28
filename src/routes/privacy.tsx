import { createFileRoute } from "@tanstack/react-router";
import { PolicyPage } from "@/components/site/PolicyPage";
import { PHONE_DISPLAY } from "@/lib/site";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy | Vallalaar Remedies" },
      {
        name: "description",
        content:
          "What information Vallalaar Remedies collects when you place an order or send an enquiry, and how it is used.",
      },
    ],
  }),
  component: Privacy,
});

function Privacy() {
  return (
    <PolicyPage
      eyebrow="Legal"
      title="Privacy Policy"
      intro="What we collect when you order or enquire, why we collect it, and how to have it removed."
      updated="August 2026"
      sections={[
        {
          heading: "What we collect",
          body: (
            <p>
              Only what is needed to fulfil an order or answer an enquiry: your name, phone number,
              delivery address and the details you choose to include in your message.
            </p>
          ),
        },
        {
          heading: "How it is used",
          body: (
            <p>
              To confirm and deliver your order, to respond to enquiries, and to contact you about
              that order. We do not sell your information or use it for unrelated marketing.
            </p>
          ),
        },
        {
          heading: "Who it is shared with",
          body: (
            <p>
              Delivery partners receive the address details required to complete the delivery.
              Orders and enquiries placed over WhatsApp are also subject to WhatsApp&rsquo;s own
              privacy terms.
            </p>
          ),
        },
        {
          heading: "Cart data on your device",
          body: (
            <p>
              Your cart is stored in your own browser so it survives a page reload. It stays on your
              device and is not sent to us until you submit an order.
            </p>
          ),
        },
        {
          heading: "Access and removal",
          body: (
            <p>
              To see what we hold about you, correct it, or have it deleted, contact us on{" "}
              {PHONE_DISPLAY} and we will action the request.
            </p>
          ),
        },
      ]}
    />
  );
}

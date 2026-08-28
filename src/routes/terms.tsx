import { createFileRoute } from "@tanstack/react-router";
import { PolicyPage } from "@/components/site/PolicyPage";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions | Vallalaar Remedies" },
      {
        name: "description",
        content:
          "Terms governing the use of the Vallalaar Remedies website and the purchase of Soliderma products.",
      },
    ],
  }),
  component: Terms,
});

function Terms() {
  return (
    <PolicyPage
      eyebrow="Legal"
      title="Terms & Conditions"
      intro="These terms cover the use of this website and the purchase of products from Vallalaar Remedies."
      updated="August 2026"
      sections={[
        {
          heading: "Product information",
          body: (
            <p>
              Soliderma™ is an Ayurvedic proprietary medicine. Information on this site describes
              the formulation and its intended use in wound care. It is not medical advice and does
              not replace consultation with a qualified practitioner, particularly for deep,
              infected or non-healing wounds.
            </p>
          ),
        },
        {
          heading: "Orders and pricing",
          body: (
            <p>
              Adding items to the cart creates an enquiry, not a binding sale. Prices, sizes and
              availability are confirmed by our team before dispatch and may change without notice.
            </p>
          ),
        },
        {
          heading: "Use of the product",
          body: (
            <p>
              Use only as directed on the label. Discontinue use and seek professional advice if
              irritation or an adverse reaction occurs. Keep out of reach of children.
            </p>
          ),
        },
        {
          heading: "Intellectual property",
          body: (
            <p>
              The Vallalaar Remedies and Soliderma names, logos, product photography and site
              content belong to Vallalaar Remedies and may not be reproduced without written
              permission.
            </p>
          ),
        },
        {
          heading: "Governing law",
          body: <p>These terms are governed by the laws of India, with jurisdiction in Chennai.</p>,
        },
      ]}
    />
  );
}

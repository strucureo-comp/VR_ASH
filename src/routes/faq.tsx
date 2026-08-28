import { createFileRoute } from "@tanstack/react-router";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Reveal } from "@/components/site/Reveal";
import { Section } from "@/components/site/Section";
import { CERTIFICATIONS, CONDITIONS } from "@/lib/site";

/** Read from the shared lists so the answers cannot drift from the pages. */
const CONDITION_LIST = CONDITIONS.map((c) => c.title.toLowerCase()).join(", ");
const CERT_LIST = CERTIFICATIONS.map((c) => c.title).join(", ");

const FAQS = [
  {
    q: "What is Soliderma?",
    a: "Soliderma is an Ayurvedic proprietary medicine presented as a multi-action wound healing spray.",
  },
  {
    q: "What is Soliderma used for?",
    a: `It is used as part of the care routine for ${CONDITION_LIST}. It supports a wound-care plan rather than replacing one.`,
  },
  {
    q: "How should Soliderma be applied?",
    a: "Use according to the product instructions and the guidance of a qualified healthcare professional.",
  },
  {
    q: "Is Soliderma herbal?",
    a: "The product packaging identifies Soliderma as a herbal product.",
  },
  {
    q: "Where is Soliderma manufactured?",
    a: "The supplied material identifies Kniss Laboratories (P) Ltd. as the manufacturer. Vallalaar Remedies markets the product.",
  },
  {
    q: "What certifications does it hold?",
    a: `${CERT_LIST}. Certificates and regulatory documentation are listed on the Our Science page and can be provided on request.`,
  },
  {
    q: "What does Soliderma cost?",
    a: "Prices are confirmed by our team over WhatsApp before dispatch, since sizes and availability can change. Adding items to the cart creates an enquiry, not a binding sale.",
  },
  {
    q: "Can I order Soliderma online?",
    a: "Yes. You can select products and send your order through WhatsApp for manual confirmation.",
  },
  {
    q: "Can clinics order in bulk?",
    a: "Yes. A dedicated clinic / practitioner enquiry pathway is provided for bulk and professional requirements.",
  },
  {
    q: "Can I use Soliderma without medical advice?",
    a: "For significant, infected, deep, diabetic or otherwise serious wounds, users should seek appropriate professional medical care. Product use should follow the approved instructions.",
  },
];

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "Soliderma FAQ | Vallalaar Remedies" },
      {
        name: "description",
        content:
          "Answers about Soliderma — what it is, where it is used, how it is applied, manufacturing, ordering and bulk clinic enquiries.",
      },
      { property: "og:title", content: "Frequently Asked Questions | Soliderma" },
      {
        property: "og:description",
        content: "Common questions about Soliderma multi action wound healing spray.",
      },
    ],
  }),
  component: Faq,
});

function Faq() {
  return (
    <>
      <section className="bg-[color:var(--surface)] px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <p className="eyebrow text-[color:var(--gold)]">FAQ</p>
          <h1 className="mt-5 text-5xl text-foreground">Frequently Asked Questions</h1>
        </div>
      </section>
      <Section>
        <Reveal className="mx-auto max-w-3xl">
          <Accordion type="single" collapsible className="w-full">
            {FAQS.map((f, i) => (
              <AccordionItem key={f.q} value={`item-${i}`}>
                <AccordionTrigger className="text-left font-display text-lg">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </Section>
    </>
  );
}

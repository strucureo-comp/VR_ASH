import { createFileRoute } from "@tanstack/react-router";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Reveal } from "@/components/site/Reveal";
import { Section } from "@/components/site/Section";
import { sharedContentQuery } from "@/lib/content/queryOptions";
import { preferSaved } from "@/lib/content/render";
import { FAQS } from "@/lib/site";

export const Route = createFileRoute("/faq")({
  loader: async ({ context }) => ({
    shared: await context.queryClient.ensureQueryData(sharedContentQuery()),
  }),
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
  const { shared } = Route.useLoaderData();
  const faqs = preferSaved(shared?.faqs ?? [], FAQS);

  return (
    <>
      <section className="bg-[color:var(--surface)] px-5 py-12 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-4xl">
          <p className="eyebrow text-[color:var(--gold)]">FAQ</p>
          <h1 className="mt-4 text-[2rem] leading-tight text-foreground sm:mt-5 sm:text-4xl lg:text-5xl">
            Frequently Asked Questions
          </h1>
        </div>
      </section>
      <Section>
        <Reveal className="mx-auto max-w-3xl">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((f, i) => (
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

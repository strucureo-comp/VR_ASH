import { createFileRoute, Link } from "@tanstack/react-router";
import { Reveal } from "@/components/site/Reveal";
import { Section, SectionLabel } from "@/components/site/Section";
import { WA_CLINIC } from "@/lib/site";

export const Route = createFileRoute("/clinics")({
  head: () => ({
    meta: [
      { title: "For Doctors & Clinics | Vallalaar Remedies" },
      {
        name: "description",
        content:
          "A dedicated enquiry channel for clinics, practitioners, pharmacies and professional buyers of Soliderma — bulk orders and documentation.",
      },
      { property: "og:title", content: "Professional Enquiries | Vallalaar Remedies" },
      {
        property: "og:description",
        content: "Bulk orders, product information and certification documents for healthcare professionals.",
      },
    ],
  }),
  component: Clinics,
});

const ITEMS = [
  { title: "Bulk Orders", body: "Discuss quantities and requirements." },
  { title: "Product Information", body: "Access available product and formulation documentation." },
  {
    title: "Certification Documents",
    body: "Review available regulatory and quality documentation.",
  },
  { title: "Direct Assistance", body: "Connect with the Vallalaar Remedies team." },
];

function Clinics() {
  return (
    <>
      <section className="bg-[color:var(--botanical-deep)] px-6 py-20 text-primary-foreground">
        <div className="mx-auto max-w-4xl">
          <p className="eyebrow text-[color:var(--gold)]">16 &nbsp;·&nbsp; For Doctors &amp; Clinics</p>
          <h1 className="mt-5 text-5xl">Professional Enquiries</h1>
          <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-primary-foreground/75">
            Better access for healthcare professionals. Vallalaar Remedies provides a dedicated
            channel for clinics, practitioners, pharmacies and other professional buyers.
          </p>
        </div>
      </section>

      <Section>
        <Reveal>
          <SectionLabel index="—" label="Professional Enquiries" />
        </Reveal>
        <div className="mt-10 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2">
          {ITEMS.map((it, i) => (
            <Reveal key={it.title} delay={i * 0.06} className="bg-card">
              <div className="h-full p-8">
                <h2 className="text-2xl text-foreground">{it.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{it.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.1}>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              to="/contact"
              className="rounded-full bg-primary px-7 py-3 text-sm font-medium text-primary-foreground"
            >
              Contact Our Team
            </Link>
            <a
              href={WA_CLINIC}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-[color:var(--burgundy)] px-7 py-3 text-sm font-medium text-[color:var(--burgundy)]"
            >
              WhatsApp Us
            </a>
          </div>
        </Reveal>
      </Section>
    </>
  );
}

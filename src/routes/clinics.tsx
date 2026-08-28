import { createFileRoute, Link } from "@tanstack/react-router";
import { Reveal } from "@/components/site/Reveal";
import { Section, SectionLabel } from "@/components/site/Section";
import { PRO_POINTS, WA_CLINIC } from "@/lib/site";

export const Route = createFileRoute("/clinics")({
  head: () => ({
    meta: [
      { title: "For Professionals | Vallalaar Remedies" },
      {
        name: "description",
        content:
          "A dedicated enquiry channel for clinics, practitioners, pharmacies and professional buyers of Soliderma — bulk orders, training and documentation.",
      },
      { property: "og:title", content: "For Healthcare Professionals | Vallalaar Remedies" },
      {
        property: "og:description",
        content:
          "Bulk orders, product training, clinical support and certification documents for healthcare professionals.",
      },
    ],
  }),
  component: Clinics,
});

function Clinics() {
  return (
    <>
      <section className="bg-[color:var(--botanical-deep)] px-6 py-20 text-primary-foreground">
        <div className="mx-auto max-w-4xl">
          <p className="eyebrow text-[color:var(--gold)]">For Professionals</p>
          <h1 className="mt-5 text-5xl">For Healthcare Professionals</h1>
          <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-primary-foreground/75">
            Better access for healthcare professionals. Vallalaar Remedies provides a dedicated
            channel for clinics, practitioners, pharmacies and other professional buyers.
          </p>
        </div>
      </section>

      <Section>
        <Reveal>
          <SectionLabel index="01" label="Professional Enquiries" />
        </Reveal>
        <div className="mt-10 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2">
          {PRO_POINTS.map((it, i) => (
            <Reveal key={it.title} delay={i * 0.06} className="bg-card">
              <div className="h-full p-8">
                <it.icon className="h-6 w-6 text-[color:var(--botanical)]" />
                <h2 className="mt-4 text-2xl text-foreground">{it.title}</h2>
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

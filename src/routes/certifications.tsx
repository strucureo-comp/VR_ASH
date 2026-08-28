import { createFileRoute } from "@tanstack/react-router";
import { Reveal } from "@/components/site/Reveal";
import { Section, SectionLabel, Note } from "@/components/site/Section";
import { CERTIFICATIONS } from "@/lib/site";

export const Route = createFileRoute("/certifications")({
  head: () => ({
    meta: [
      { title: "Our Science | Vallalaar Remedies" },
      {
        name: "description",
        content:
          "Certification and regulatory documentation associated with Soliderma and its manufacturing by Kniss Laboratories (P) Ltd.",
      },
      { property: "og:title", content: "Trust Should Be Verifiable | Vallalaar Remedies" },
      {
        property: "og:description",
        content: "WHO / GMP, AYUSH and ISO 9001:2015 documentation information for Soliderma.",
      },
    ],
  }),
  component: Certifications,
});

function Certifications() {
  return (
    <>
      <section className="bg-[color:var(--surface)] px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <p className="eyebrow text-[color:var(--gold)]">Our Science</p>
          <h1 className="mt-5 text-5xl text-foreground">Manufactured with Care.</h1>
          <p className="mt-6 text-[15px] text-muted-foreground">Soliderma is manufactured by:</p>
          <p className="mt-2 font-display text-2xl text-[color:var(--burgundy)]">
            Kniss Laboratories (P) Ltd.
          </p>
          <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
            The supplied product material identifies the manufacturer and states WHO / GMP / ISO
            9001:2015 certification. Vallalaar Remedies markets Soliderma as part of its Ayurvedic
            healthcare offering.
          </p>
        </div>
      </section>

      <Section>
        <Reveal>
          <SectionLabel index="01" label="Certifications" />
          <h2 className="mt-6 text-4xl text-foreground">Trust Should Be Verifiable.</h2>
          <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
            We believe credibility comes from transparency. Explore the available certification and
            regulatory documentation associated with Soliderma and its manufacturing.
          </p>
        </Reveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {CERTIFICATIONS.map((d, i) => (
            <Reveal key={d.title} delay={i * 0.06}>
              <article className="h-full rounded-lg border border-border bg-card p-7">
                <d.icon className="h-6 w-6 text-[color:var(--botanical)]" />
                <h3 className="mt-4 text-xl text-foreground">{d.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{d.body}</p>
                <p className="mt-6 text-xs text-[color:var(--burgundy)]">
                  View / Download Documents
                </p>
              </article>
            </Reveal>
          ))}
        </div>
        <Note>
          Only verified certificates and current regulatory documentation are published here.
          &ldquo;Clinically researched&rdquo; describes the formulation&rsquo;s development, not a
          certification.
        </Note>
      </Section>
    </>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { Reveal } from "@/components/site/Reveal";
import { Section, SectionLabel, Note } from "@/components/site/Section";
import leaf from "@/assets/leaf-texture.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Vallalaar Remedies | Ayurvedic Healthcare, Chennai" },
      {
        name: "description",
        content:
          "Vallalaar Remedies brings an Ayurvedic perspective to modern healthcare needs, with Soliderma™ as its flagship herbal wound-care spray.",
      },
      { property: "og:title", content: "Rooted in Traditional Healing | Vallalaar Remedies" },
      {
        property: "og:description",
        content: "Traditional knowledge, purposeful formulation and modern convenience.",
      },
    ],
  }),
  component: About,
});

const APPROACH = [
  { title: "Traditional Knowledge", body: "Respecting the foundations of Ayurveda." },
  {
    title: "Purposeful Formulation",
    body: "Bringing selected ingredients together through a defined preparation process.",
  },
  { title: "Modern Convenience", body: "Creating products that are practical to use." },
  {
    title: "Quality & Transparency",
    body: "Making product, formulation and certification information accessible.",
  },
];

function About() {
  return (
    <>
      <section className="relative overflow-hidden bg-[color:var(--surface)] px-6 py-20">
        <img
          src={leaf}
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="pointer-events-none absolute inset-y-0 right-0 h-full w-1/3 object-cover opacity-15"
        />
        <div className="relative mx-auto max-w-4xl">
          <p className="eyebrow text-[color:var(--gold)]">08 &nbsp;·&nbsp; About</p>
          <h1 className="mt-5 text-5xl text-foreground">
            Rooted in Traditional Healing. Focused on Better Care.
          </h1>
          <div className="mt-7 max-w-2xl space-y-4 text-[15px] leading-relaxed text-muted-foreground">
            <p>Vallalaar Remedies brings an Ayurvedic perspective to modern healthcare needs.</p>
            <p>
              Our focus is on developing and bringing forward herbal formulations that can be
              presented in practical, accessible formats for today&rsquo;s users.
            </p>
            <p>
              Our flagship product, Soliderma&trade;, represents this approach — combining an
              Ayurvedic proprietary formulation with a convenient modern spray format.
            </p>
          </div>
        </div>
      </section>

      <Section>
        <Reveal>
          <SectionLabel index="—" label="Our Approach" />
        </Reveal>
        <div className="mt-10 grid gap-10 sm:grid-cols-2">
          {APPROACH.map((a, i) => (
            <Reveal key={a.title} delay={i * 0.06}>
              <div className="border-t-2 border-[color:var(--botanical)] pt-5">
                <h2 className="text-2xl text-foreground">{a.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{a.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section className="bg-[color:var(--surface)]">
        <Reveal>
          <SectionLabel index="13" label="Testimonials" />
          <h2 className="mt-6 text-4xl text-foreground">Trusted Through Experience.</h2>
          <blockquote className="mt-8 max-w-2xl font-display text-2xl leading-snug text-[color:var(--burgundy)]">
            &ldquo;Care is more than a product. It is a journey.&rdquo;
          </blockquote>
          <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
            Hear from doctors, practitioners and customers who have experienced the product as part
            of their wound-care journey.
          </p>
          <Note>
            Testimonials are displayed using the exact approved wording supplied by the client,
            together with appropriate attribution and consent.
          </Note>
        </Reveal>
      </Section>
    </>
  );
}

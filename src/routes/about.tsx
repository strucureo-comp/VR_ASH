import { createFileRoute } from "@tanstack/react-router";
import { Quote } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { Section, SectionLabel, Note } from "@/components/site/Section";
import { Stars } from "@/components/site/Stars";
import { sharedContentQuery } from "@/lib/content/queryOptions";
import { iconRows } from "@/lib/content/render";
import { ABOUT_SNIPPET, CERTIFICATIONS, metrics, TESTIMONIALS } from "@/lib/site";
import leaf from "@/assets/leaf-texture.jpg";

export const Route = createFileRoute("/about")({
  // Only for the certification count in the metrics bar, which /certifications
  // and the home page take from the same node.
  loader: async ({ context }) => ({
    shared: await context.queryClient.ensureQueryData(sharedContentQuery()),
  }),
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
  const { shared } = Route.useLoaderData();
  const metricsBar = metrics(iconRows(shared?.certifications ?? [], CERTIFICATIONS).length);

  return (
    <>
      <section className="relative overflow-hidden bg-[color:var(--surface)] px-5 py-12 sm:px-6 sm:py-20">
        <img
          src={leaf}
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="pointer-events-none absolute inset-y-0 right-0 hidden h-full w-1/3 object-cover opacity-15 [mask-image:linear-gradient(to_left,black,transparent)] md:block"
        />
        <div className="relative mx-auto max-w-4xl">
          <p className="eyebrow text-[color:var(--gold)]">About Us</p>
          <h1 className="mt-4 text-[2rem] leading-tight text-foreground sm:mt-5 sm:text-4xl lg:text-5xl">
            Rooted in Traditional Healing. Focused on Better Care.
          </h1>
          <div className="mt-7 max-w-2xl space-y-4 text-[15px] leading-relaxed text-muted-foreground">
            <p>{ABOUT_SNIPPET}</p>
            <p>
              Our focus is on developing and bringing forward herbal formulations that can be
              presented in practical, accessible formats for today&rsquo;s users.
            </p>
            <p>
              Our flagship product, Soliderma&trade;, represents this approach — combining an
              Ayurvedic proprietary formulation with a convenient modern spray format.
            </p>
          </div>
          <dl className="mt-12 grid gap-8 border-t border-border pt-8 sm:grid-cols-4">
            {metricsBar.map((m) => (
              <div key={m.label}>
                <dt className="font-display text-3xl text-[color:var(--burgundy)]">{m.value}</dt>
                <dd className="mt-1 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  {m.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <Section>
        <Reveal>
          <SectionLabel index="01" label="Our Approach" />
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

      {/* Same testimonials as the home page snippet. */}
      <Section id="testimonials" className="bg-[color:var(--surface)]">
        <Reveal>
          <SectionLabel index="02" label="Testimonials" />
          <h2 className="mt-5 text-[1.75rem] leading-tight text-foreground sm:mt-6 sm:text-4xl">
            Real Stories. Real Results.
          </h2>
          <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
            Doctors, practitioners and customers who have used the product as part of their
            wound-care journey.
          </p>
        </Reveal>
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.06}>
              <figure className="flex h-full flex-col rounded-2xl border border-border bg-card p-7">
                <Quote className="h-7 w-7 text-[color:var(--gold)]" />
                <Stars rating={t.rating} className="mt-4" />
                <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-foreground">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-6 border-t border-border pt-4">
                  <span className="block font-display text-lg text-foreground">{t.name}</span>
                  <span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                    {t.role}
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
        <Note>
          Testimonials are displayed using the exact approved wording supplied by the client,
          together with appropriate attribution and consent.
        </Note>
      </Section>
    </>
  );
}

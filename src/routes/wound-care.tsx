import { createFileRoute, Link } from "@tanstack/react-router";
import { Reveal } from "@/components/site/Reveal";
import { Section, SectionLabel, Note } from "@/components/site/Section";

export const Route = createFileRoute("/wound-care")({
  head: () => ({
    meta: [
      { title: "Understanding Wound Care | Vallalaar Remedies" },
      {
        name: "description",
        content:
          "Wound-care resources on diabetic wounds, bed sores, accident injuries and burn injuries, with encouragement to seek professional medical guidance.",
      },
      { property: "og:title", content: "Understanding Wound Care | Vallalaar Remedies" },
      {
        property: "og:description",
        content: "Different wounds require different approaches. Explore our wound-care resources.",
      },
    ],
  }),
  component: WoundCare,
});

const TOPICS = [
  { title: "Diabetic Wounds", body: "Understanding wound-care considerations." },
  { title: "Bed Sores", body: "Understanding pressure-related wounds." },
  { title: "Accident Injuries", body: "Basic wound-care information." },
  { title: "Burn / Fire Injuries", body: "Important considerations for burn-related wounds." },
];

function WoundCare() {
  return (
    <>
      <section className="bg-[color:var(--botanical-deep)] px-6 py-20 text-primary-foreground">
        <div className="mx-auto max-w-4xl">
          <p className="eyebrow text-[color:var(--gold)]">14 &nbsp;·&nbsp; Wound Care</p>
          <h1 className="mt-5 text-5xl">Understanding Wound Care</h1>
          <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-primary-foreground/75">
            A wound needs appropriate attention, consistency and care. Different wounds can require
            different approaches depending on their cause, severity and the individual&rsquo;s overall
            condition.
          </p>
        </div>
      </section>

      <Section>
        <Reveal>
          <SectionLabel index="—" label="Explore" />
          <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
            Our wound-care resources are designed to help users better understand the importance of
            proper care while encouraging professional medical guidance where appropriate.
          </p>
        </Reveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {TOPICS.map((t, i) => (
            <Reveal key={t.title} delay={i * 0.06}>
              <article className="h-full rounded-lg border border-border bg-card p-8">
                <h2 className="text-2xl text-foreground">{t.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
        <Note>
          For significant, infected, deep, diabetic or otherwise serious wounds, users should seek
          appropriate professional medical care.
        </Note>
        <Reveal delay={0.1}>
          <Link
            to="/soliderma"
            className="mt-10 inline-block border-b border-[color:var(--burgundy)] pb-1 text-sm font-medium text-[color:var(--burgundy)]"
          >
            Explore Soliderma
          </Link>
        </Reveal>
      </Section>
    </>
  );
}

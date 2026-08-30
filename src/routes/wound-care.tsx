import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { Section, SectionLabel, Note } from "@/components/site/Section";
import { contentId } from "@/lib/content/paths";
import { productContentQuery } from "@/lib/content/queryOptions";
import { iconRows } from "@/lib/content/render";
import { isSolidermaHandle } from "@/lib/shopify/format";
import { productsQuery } from "@/lib/shopify/queryOptions";
import { CONDITIONS, GUIDES } from "@/lib/site";

export const Route = createFileRoute("/wound-care")({
  /**
   * The conditions here are Soliderma's own, edited on its admin page rather than
   * duplicated for this route — which is why a page with no product of its own has
   * to resolve one before it can read anything.
   */
  loader: async ({ context }) => {
    const products = await context.queryClient.ensureQueryData(productsQuery(24));
    const soliderma = products.find((product) => isSolidermaHandle(product.handle));
    if (!soliderma) return { content: null };
    return {
      content: await context.queryClient.ensureQueryData(
        productContentQuery(contentId(soliderma.id)),
      ),
    };
  },
  head: () => ({
    meta: [
      { title: "Wellness Guide | Vallalaar Remedies" },
      {
        name: "description",
        content:
          "Wound-care guides covering diabetic wounds, bed sores, burns, post-surgical care and chronic ulcers, with encouragement to seek professional medical guidance.",
      },
      { property: "og:title", content: "Wellness Guide | Vallalaar Remedies" },
      {
        property: "og:description",
        content: "Different wounds require different approaches. Explore our wound-care guides.",
      },
    ],
  }),
  component: WoundCare,
});

function WoundCare() {
  const { content } = Route.useLoaderData();
  const conditions = iconRows(content?.conditions ?? [], CONDITIONS);

  return (
    <>
      <section className="bg-[color:var(--botanical-deep)] px-5 py-12 text-primary-foreground sm:px-6 sm:py-20">
        <div className="mx-auto max-w-4xl">
          <p className="eyebrow text-[color:var(--gold)]">Wellness Guide</p>
          <h1 className="mt-4 text-[2rem] leading-tight sm:mt-5 sm:text-4xl lg:text-5xl">
            Learn. Care. Stay Healthy.
          </h1>
          <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-primary-foreground/75">
            A wound needs appropriate attention, consistency and care. Different wounds can require
            different approaches depending on their cause, severity and the individual&rsquo;s
            overall condition.
          </p>
        </div>
      </section>

      {/* All conditions — the same list as the home "Works On" grid. */}
      <Section id="conditions">
        <Reveal>
          <SectionLabel index="01" label="All Conditions" />
          <h2 className="mt-5 max-w-2xl text-[1.75rem] leading-tight text-foreground sm:mt-6 sm:text-4xl">
            Care that works where you need it most
          </h2>
          <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
            Soliderma is used as part of the care routine for the situations below. It supports a
            wound-care plan — it does not replace one.
          </p>
        </Reveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {conditions.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.05}>
              <article className="flex h-full flex-col rounded-2xl border border-border bg-card p-6">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[color:var(--botanical)]/10">
                  <c.icon className="h-5 w-5 text-[color:var(--botanical)]" />
                </span>
                <h3 className="mt-5 text-lg leading-tight text-foreground">{c.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
        <Note>
          For significant, infected, deep, diabetic or otherwise serious wounds, users should seek
          appropriate professional medical care.
        </Note>
      </Section>
      {/* Guides — the articles the home page cards link into. */}
      <Section className="border-y border-border bg-[color:var(--surface)]">
        <Reveal>
          <SectionLabel index="02" label="Guides" />
          <h2 className="mt-5 max-w-2xl text-[1.75rem] leading-tight text-foreground sm:mt-6 sm:text-4xl">
            Practical care at home
          </h2>
        </Reveal>
        <div className="mt-14 space-y-14">
          {GUIDES.map((g, i) => (
            <Reveal key={g.slug} delay={i * 0.05}>
              <article
                id={g.slug}
                className="scroll-mt-32 grid gap-8 border-t border-border pt-10 first:border-t-0 first:pt-0 lg:grid-cols-[0.9fr_1.1fr]"
              >
                <img
                  src={g.image}
                  alt=""
                  loading="lazy"
                  className="h-56 w-full rounded-2xl object-cover lg:h-full"
                />
                <div>
                  <p className="eyebrow text-[color:var(--gold)]">{g.tag}</p>
                  <h3 className="mt-3 text-2xl leading-tight text-foreground">{g.title}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">{g.body}</p>
                  <ul className="mt-6 space-y-3">
                    {g.points.map((point) => (
                      <li
                        key={point}
                        className="flex gap-3 text-sm leading-relaxed text-foreground"
                      >
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--gold)]" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
        <Note>
          General guidance only. It does not replace the instructions of your doctor, nurse or
          Ayurvedic practitioner for your specific wound.
        </Note>
        <Reveal delay={0.1}>
          <Link
            to="/soliderma"
            className="mt-10 inline-flex items-center gap-2 border-b border-[color:var(--burgundy)] pb-1 text-sm font-medium text-[color:var(--burgundy)]"
          >
            Explore Soliderma <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </Section>
    </>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { Section, SectionLabel, Note } from "@/components/site/Section";
import { PRODUCTS, priceLabel } from "@/lib/products";

export const Route = createFileRoute("/products/")({
  head: () => ({
    meta: [
      { title: "All Products | Vallalaar Remedies" },
      {
        name: "description",
        content:
          "Browse the full Vallalaar Remedies range — Soliderma wound healing spray and upcoming Ayurvedic wound-care preparations.",
      },
      { property: "og:title", content: "All Products — Vallalaar Remedies" },
      {
        property: "og:description",
        content: "The complete Ayurvedic wound-care range from Vallalaar Remedies.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProductsIndex,
});

function ProductsIndex() {
  return (
    <Section className="bg-[color:var(--surface)]">
      <Reveal>
        <SectionLabel index="01" label="Catalogue" />
        <h1 className="mt-6 max-w-2xl text-4xl text-foreground sm:text-5xl">
          The complete Vallalaar range
        </h1>
        <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
          Select a product to open its detail page — formulation, sizes and ordering.
        </p>
      </Reveal>

      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {PRODUCTS.map((p, i) => {
          return (
            <Reveal key={p.slug} delay={i * 0.06}>
              <Link
                to="/products/$slug"
                params={{ slug: p.slug }}
                className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-[color:var(--gold)]"
              >
                <div className="flex h-52 items-center justify-center bg-[color:var(--ivory)] p-6">
                  {p.image ? (
                    <img
                      src={p.image}
                      alt={`${p.name} ${p.subtitle}`}
                      width={912}
                      height={1200}
                      loading="lazy"
                      className="h-full w-auto object-contain drop-shadow-lg transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <span className="font-display text-2xl text-muted-foreground">
                      {p.name.charAt(0)}
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h2 className="text-2xl text-foreground">{p.name}</h2>
                  <p className="mt-1 text-sm text-[color:var(--burgundy)]">{p.subtitle}</p>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {p.blurb}
                  </p>
                  <p className="mt-4 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                    {p.variants.map((v) => v.size).join(" · ")}
                  </p>
                  <p className="mt-1 font-display text-xl text-foreground">
                    {p.available ? priceLabel(p) : "Coming soon"}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-[color:var(--gold)]">
                    {p.available ? "View product" : "Notify me"}
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>

      <Note>
        Ayurvedic proprietary medicine. Use as directed. Consult a qualified practitioner for deep,
        infected or non-healing wounds.
      </Note>
    </Section>
  );
}

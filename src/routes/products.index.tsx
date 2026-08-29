import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { Section, SectionLabel, Note } from "@/components/site/Section";
import { imageAlt, priceRangeLabel, sizedImage, variantLabel } from "@/lib/shopify/format";
import { productsQuery } from "@/lib/shopify/queryOptions";

export const Route = createFileRoute("/products/")({
  loader: async ({ context }) => ({
    products: await context.queryClient.ensureQueryData(productsQuery(24)),
  }),
  head: () => ({
    meta: [
      { title: "All Products | Vallalaar Remedies" },
      {
        name: "description",
        content:
          "Browse the full Vallalaar Remedies range — Soliderma wound healing spray and our other Ayurvedic wound-care preparations.",
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
  const { products } = Route.useLoaderData();

  return (
    <Section className="bg-[color:var(--surface)]">
      <Reveal>
        <SectionLabel index="01" label="Catalogue" />
        <h1 className="mt-5 max-w-2xl text-[2rem] leading-tight text-foreground sm:mt-6 sm:text-4xl lg:text-5xl">
          The complete Vallalaar range
        </h1>
        <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
          Select a product to open its detail page — formulation, sizes and ordering.
        </p>
      </Reveal>

      {products.length === 0 ? (
        <p className="mt-14 rounded-lg border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          Our catalogue is being updated. Please check back shortly.
        </p>
      ) : (
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p, i) => {
            const sizes = p.variants
              .map((v) => variantLabel(v.title))
              .filter((label) => label !== "")
              .join(" · ");

            return (
              <Reveal key={p.handle} delay={i * 0.06}>
                <Link
                  to="/products/$slug"
                  params={{ slug: p.handle }}
                  className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-[color:var(--gold)]"
                >
                  <div className="flex h-52 items-center justify-center bg-[color:var(--ivory)] p-6">
                    {p.featuredImage ? (
                      <img
                        src={sizedImage(p.featuredImage.url, 600)}
                        alt={imageAlt(p.featuredImage.altText, p)}
                        loading="lazy"
                        className="h-full w-auto object-contain drop-shadow-lg transition-transform duration-500 sm:group-hover:scale-105"
                      />
                    ) : (
                      <span className="font-display text-2xl text-muted-foreground">
                        {p.title.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h2 className="text-2xl text-foreground">{p.title}</h2>
                    {p.productType && (
                      <p className="mt-1 text-sm text-[color:var(--burgundy)]">{p.productType}</p>
                    )}
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {p.description}
                    </p>
                    {sizes && (
                      <p className="mt-4 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                        {sizes}
                      </p>
                    )}
                    <p className="mt-1 font-display text-xl text-foreground">
                      {p.availableForSale ? priceRangeLabel(p) : "Coming soon"}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-[color:var(--gold)]">
                      {p.availableForSale ? "View product" : "Notify me"}
                      <ArrowRight className="h-3.5 w-3.5 transition-transform sm:group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      )}

      <Note>
        Ayurvedic proprietary medicine. Use as directed. Consult a qualified practitioner for deep,
        infected or non-healing wounds.
      </Note>
    </Section>
  );
}

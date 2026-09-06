import { createFileRoute, Link } from "@tanstack/react-router";
import { Reveal } from "@/components/site/Reveal";
import { Section, SectionLabel, Note } from "@/components/site/Section";
import { CardAddToCart } from "@/components/site/AddToCart";
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
                <div className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:border-[color:var(--gold)] hover:shadow-md">
                  <Link
                    to="/products/$slug"
                    params={{ slug: p.handle }}
                    className="block cursor-pointer"
                  >
                    <div className="flex h-56 items-center justify-center bg-[color:var(--ivory)] p-6 transition-colors group-hover:bg-[color:var(--ivory)]/80">
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
                  </Link>

                  <div className="flex flex-1 flex-col p-6">
                    <Link
                      to="/products/$slug"
                      params={{ slug: p.handle }}
                      className="block group-hover:text-[color:var(--burgundy)] transition-colors"
                    >
                      <h2 className="text-2xl text-foreground font-medium transition-colors group-hover:text-[color:var(--burgundy)]">
                        {p.title}
                      </h2>
                    </Link>

                    {p.productType && (
                      <p className="mt-1 text-sm text-[color:var(--burgundy)]">{p.productType}</p>
                    )}

                    <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-3">
                      {p.description}
                    </p>

                    <div className="mt-5 pt-4 border-t border-border flex items-center justify-between gap-3">
                      <div>
                        {sizes && (
                          <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                            {sizes}
                          </p>
                        )}
                        <p className="font-display text-xl font-semibold text-foreground">
                          {p.availableForSale ? priceRangeLabel(p) : "Coming soon"}
                        </p>
                      </div>

                      {p.availableForSale && (
                        <CardAddToCart product={p} />
                      )}
                    </div>
                  </div>
                </div>
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

import { createFileRoute, Link } from "@tanstack/react-router";
import { Reveal } from "@/components/site/Reveal";
import { Section, SectionLabel, Note } from "@/components/site/Section";
import { CardAddToCart } from "@/components/site/AddToCart";
import {
  imageAlt,
  isSolidermaHandle,
  priceRangeLabel,
  productSizes,
  productSubtitle,
  sizedImage,
  variantLabel,
} from "@/lib/shopify/format";
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
        <div
          className={`mt-14 grid gap-6 ${
            products.length === 1
              ? "max-w-md mx-auto"
              : products.length === 2
                ? "max-w-3xl mx-auto sm:grid-cols-2"
                : "sm:grid-cols-2 lg:grid-cols-3"
          }`}
        >
          {products.map((p, i) => {
            const isSoliderma = isSolidermaHandle(p.handle);
            const cardLinkProps = isSoliderma
              ? { to: "/soliderma" as const }
              : { to: "/products/$slug" as const, params: { slug: p.handle } };
            const sizes = productSizes(p);

            return (
              <Reveal key={p.handle} delay={i * 0.06}>
                <div className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:border-[color:var(--gold)] hover:shadow-md">
                  <Link
                    {...cardLinkProps}
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
                      {...cardLinkProps}
                      className="block group-hover:text-[color:var(--burgundy)] transition-colors"
                    >
                      <h2 className="text-2xl text-foreground font-medium transition-colors group-hover:text-[color:var(--burgundy)]">
                        {p.title}
                      </h2>
                    </Link>

                    {productSubtitle(p) ? (
                      <p className="mt-1 text-xs uppercase tracking-[0.14em] text-[color:var(--gold)] font-semibold">
                        {productSubtitle(p)}
                      </p>
                    ) : null}

                    {p.description ? (
                      <p className="mt-2.5 flex-1 text-xs sm:text-sm leading-relaxed text-foreground/80">
                        {p.description}
                      </p>
                    ) : null}

                    {p.tags && p.tags.length > 0 ? (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {p.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-[color:var(--botanical)]/10 px-2 py-0.5 text-[10px] font-semibold text-[color:var(--botanical)]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    ) : null}

                    <div className="mt-5 pt-4 border-t border-border flex items-center justify-between gap-3">
                      <div>
                        {sizes ? (
                          <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground font-medium">
                            {sizes}
                          </p>
                        ) : null}
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

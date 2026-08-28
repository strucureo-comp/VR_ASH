import { createFileRoute, Link, notFound, redirect } from "@tanstack/react-router";
import { Reveal } from "@/components/site/Reveal";
import { Section, SectionLabel, Note } from "@/components/site/Section";
import { AddToCart } from "@/components/site/AddToCart";
import { getProduct, PRODUCTS, priceLabel, variantPriceLabel } from "@/lib/products";

export const Route = createFileRoute("/products/$slug")({
  loader: ({ params }) => {
    if (params.slug === "soliderma") throw redirect({ to: "/soliderma" });
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Product unavailable | Vallalaar Remedies" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { product } = loaderData;
    const title = `${product.name} | Vallalaar Remedies`;
    return {
      meta: [
        { title },
        { name: "description", content: product.blurb },
        { property: "og:title", content: title },
        { property: "og:description", content: product.blurb },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  notFoundComponent: ProductNotFound,
  component: ProductDetail,
});

function ProductNotFound() {
  return (
    <Section className="bg-[color:var(--surface)]">
      <h1 className="text-4xl text-foreground">Product not found</h1>
      <p className="mt-4 text-muted-foreground">This product is not part of the current range.</p>
      <Link
        to="/products"
        className="mt-8 inline-flex text-sm text-[color:var(--burgundy)] underline"
      >
        Back to all products
      </Link>
    </Section>
  );
}

function ProductDetail() {
  const { product } = Route.useLoaderData();
  const others = PRODUCTS.filter((p) => p.slug !== product.slug);

  return (
    <>
      <Section className="bg-[color:var(--surface)]">
        <Reveal>
          <Link to="/products" className="eyebrow text-muted-foreground hover:text-primary">
            ← All products
          </Link>
        </Reveal>
        <div className="mt-8 grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <div className="flex h-80 items-center justify-center rounded-xl border border-border bg-[color:var(--ivory)] p-8 lg:h-[420px]">
              {product.image ? (
                <img
                  src={product.image}
                  alt={`${product.name} ${product.subtitle}`}
                  width={912}
                  height={1200}
                  className="h-full w-auto object-contain drop-shadow-xl"
                />
              ) : (
                <span className="font-display text-5xl text-muted-foreground">
                  {product.name.charAt(0)}
                </span>
              )}
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="eyebrow text-[color:var(--gold)]">Product</p>
            <h1 className="mt-4 text-4xl text-foreground sm:text-5xl">{product.name}</h1>
            <p className="mt-3 font-display text-xl text-[color:var(--burgundy)]">
              {product.subtitle}
            </p>
            <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-muted-foreground">
              {product.blurb}
            </p>
            <dl className="mt-8 grid max-w-md grid-cols-2 gap-6 text-sm">
              <div>
                <dt className="eyebrow text-muted-foreground">Sizes</dt>
                <dd className="mt-1 text-foreground">
                  {product.variants.map((v) => v.size).join(" · ")}
                </dd>
              </div>
              <div>
                <dt className="eyebrow text-muted-foreground">Status</dt>
                <dd className="mt-1 text-foreground">
                  {product.available ? "Available" : "In development"}
                </dd>
              </div>
              <div>
                <dt className="eyebrow text-muted-foreground">Price</dt>
                <dd className="mt-1 font-display text-xl text-foreground">
                  {product.available ? priceLabel(product) : "—"}
                </dd>
              </div>
            </dl>
            <div className="mt-9 space-y-4">
              <AddToCart product={product} />
              <Link
                to="/contact"
                className="inline-flex rounded-full border border-[color:var(--burgundy)] px-7 py-3 text-sm font-medium text-[color:var(--burgundy)]"
              >
                Send an Enquiry
              </Link>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section>
        <Reveal>
          <SectionLabel index="02" label="Sizes" />
          <h2 className="mt-6 text-3xl text-foreground">Available sizes</h2>
        </Reveal>
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {product.variants.map((v, i) => (
            <Reveal key={v.size} delay={i * 0.06}>
              <div className="h-full rounded-lg border border-border bg-card p-7">
                <h3 className="text-2xl text-foreground">{v.size}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{v.note}</p>
                <p className="mt-4 font-display text-lg text-foreground">{variantPriceLabel(v)}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <h2 className="mt-16 text-3xl text-foreground">Other products</h2>
        </Reveal>
        <div className="mt-8 grid gap-5 sm:grid-cols-3">
          {others.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.06}>
              <Link
                to="/products/$slug"
                params={{ slug: p.slug }}
                className="block h-full rounded-lg border border-border p-6 transition-colors hover:border-[color:var(--gold)]"
              >
                <h3 className="text-lg text-foreground">{p.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.blurb}</p>
              </Link>
            </Reveal>
          ))}
        </div>
        <Note>Formulations under development are not yet available for purchase.</Note>
      </Section>
    </>
  );
}

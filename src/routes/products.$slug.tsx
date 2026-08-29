import { createFileRoute, Link, notFound, redirect } from "@tanstack/react-router";
import { Reveal } from "@/components/site/Reveal";
import { Section, SectionLabel, Note } from "@/components/site/Section";
import { AddToCart } from "@/components/site/AddToCart";
import {
  formatMoney,
  imageAlt,
  isSolidermaHandle,
  priceRangeLabel,
  sizedImage,
  variantLabel,
} from "@/lib/shopify/format";
import { productQuery, productsQuery } from "@/lib/shopify/queryOptions";

export const Route = createFileRoute("/products/$slug")({
  loader: async ({ params, context }) => {
    // Soliderma has its own long-form page; the generic template would be a
    // downgrade for it.
    if (isSolidermaHandle(params.slug)) throw redirect({ to: "/soliderma" });

    const [product, all] = await Promise.all([
      context.queryClient.ensureQueryData(productQuery(params.slug)),
      context.queryClient.ensureQueryData(productsQuery(24)),
    ]);
    if (!product) throw notFound();
    return { product, others: all.filter((p) => p.handle !== product.handle).slice(0, 3) };
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
    const title = product.seoTitle?.trim() || `${product.title} | Vallalaar Remedies`;
    const description = product.seoDescription?.trim() || product.description;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        ...(product.featuredImage
          ? [{ property: "og:image", content: sizedImage(product.featuredImage.url, 1200) }]
          : []),
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
  const { product, others } = Route.useLoaderData();
  const sizes = product.variants.map((v) => variantLabel(v.title)).filter((label) => label !== "");

  return (
    <>
      <Section className="bg-[color:var(--surface)]">
        <Reveal>
          <Link to="/products" className="eyebrow text-muted-foreground sm:hover:text-primary">
            ← All products
          </Link>
        </Reveal>
        <div className="mt-8 grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <div className="flex h-80 items-center justify-center rounded-xl border border-border bg-[color:var(--ivory)] p-8 lg:h-[420px]">
              {product.featuredImage ? (
                <img
                  src={sizedImage(product.featuredImage.url, 900)}
                  alt={imageAlt(product.featuredImage.altText, product)}
                  className="h-full w-auto object-contain drop-shadow-xl"
                />
              ) : (
                <span className="font-display text-5xl text-muted-foreground">
                  {product.title.charAt(0)}
                </span>
              )}
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="eyebrow text-[color:var(--gold)]">Product</p>
            <h1 className="mt-4 text-[2rem] leading-tight text-foreground sm:text-4xl lg:text-5xl">
              {product.title}
            </h1>
            {product.productType && (
              <p className="mt-3 font-display text-xl text-[color:var(--burgundy)]">
                {product.productType}
              </p>
            )}
            <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-muted-foreground">
              {product.description}
            </p>
            <dl className="mt-8 grid max-w-md grid-cols-2 gap-6 text-sm">
              {sizes.length > 0 && (
                <div>
                  <dt className="eyebrow text-muted-foreground">Sizes</dt>
                  <dd className="mt-1 text-foreground">{sizes.join(" · ")}</dd>
                </div>
              )}
              <div>
                <dt className="eyebrow text-muted-foreground">Status</dt>
                <dd className="mt-1 text-foreground">
                  {product.availableForSale ? "Available" : "Out of stock"}
                </dd>
              </div>
              <div>
                <dt className="eyebrow text-muted-foreground">Price</dt>
                <dd className="mt-1 font-display text-xl text-foreground">
                  {priceRangeLabel(product)}
                </dd>
              </div>
            </dl>
            <div className="mt-9 space-y-4">
              <AddToCart product={product} />
              <Link
                to="/contact"
                className="inline-flex min-h-12 items-center rounded-full border border-[color:var(--burgundy)] px-7 text-sm font-medium text-[color:var(--burgundy)]"
              >
                Send an Enquiry
              </Link>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section>
        {product.variants.length > 1 && (
          <>
            <Reveal>
              <SectionLabel index="02" label="Sizes" />
              <h2 className="mt-6 text-3xl text-foreground">Available sizes</h2>
            </Reveal>
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {product.variants.map((v, i) => (
                <Reveal key={v.id} delay={i * 0.06}>
                  <div className="h-full rounded-lg border border-border bg-card p-7">
                    <h3 className="text-2xl text-foreground">{variantLabel(v.title) || v.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {v.availableForSale ? "In stock" : "Out of stock"}
                    </p>
                    <p className="mt-4 font-display text-lg text-foreground">
                      {formatMoney(v.price)}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </>
        )}

        {others.length > 0 && (
          <>
            <Reveal>
              <h2 className="mt-16 text-3xl text-foreground">Other products</h2>
            </Reveal>
            <div className="mt-8 grid gap-5 sm:grid-cols-3">
              {others.map((p, i) => (
                <Reveal key={p.handle} delay={i * 0.06}>
                  <Link
                    to="/products/$slug"
                    params={{ slug: p.handle }}
                    className="block h-full rounded-lg border border-border p-6 transition-colors sm:hover:border-[color:var(--gold)]"
                  >
                    <h3 className="text-lg text-foreground">{p.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {p.description}
                    </p>
                  </Link>
                </Reveal>
              ))}
            </div>
          </>
        )}
        <Note>Prices, sizes and availability come from our Shopify store in real time.</Note>
      </Section>
    </>
  );
}

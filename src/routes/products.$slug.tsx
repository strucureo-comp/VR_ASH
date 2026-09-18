import { createFileRoute, Link, notFound, redirect } from "@tanstack/react-router";
import { Reveal } from "@/components/site/Reveal";
import { Section, SectionLabel, Note } from "@/components/site/Section";
import { AddToCart } from "@/components/site/AddToCart";
import { MobileBuyStage } from "@/components/site/MobileBuyStage";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { DesktopScrollytelling, MobileScrollytelling } from "@/components/site/ProductScrollytelling";
import { StickySteps } from "@/components/site/StickySteps";
import { resolveIcon } from "@/lib/content/icons";
import { contentId } from "@/lib/content/paths";
import { productContentQuery } from "@/lib/content/queryOptions";
import { paragraphs } from "@/lib/content/render";
import {
  formatMoney,
  imageAlt,
  isSolidermaHandle,
  priceRangeLabel,
  productSubtitle,
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
    // Nothing is inherited from another product here: a record that does not exist
    // simply leaves every section below absent. There is no fallback array to fall
    // back to, and Soliderma's copy would be wrong for anything else.
    const content = await context.queryClient.ensureQueryData(
      productContentQuery(contentId(product.id)),
    );
    return {
      product,
      content,
      others: all.filter((p) => p.handle !== product.handle).slice(0, 3),
    };
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
  const { product, content, others } = Route.useLoaderData();
  const story = paragraphs(content?.longDescription ?? "");
  const sizes = product.variants.map((v) => variantLabel(v.title)).filter((label) => label !== "");
  const displaySizes =
    sizes.length > 0
      ? sizes
      : isSolidermaHandle(product.handle)
        ? ["50ml Spray Bottle"]
        : [];
  // The phone stage turns a front pose into a back one, so it wants the first two
  // gallery images in Shopify's own order. `featuredImage` is the only fallback
  // when a product has no gallery at all.
  const gallery =
    product.images.length > 0
      ? product.images
      : product.featuredImage
        ? [product.featuredImage]
        : [];
  const stageImages = gallery.slice(0, 2).map((img) => ({
    src: sizedImage(img.url, 900),
    alt: imageAlt(img.altText, product),
  }));

  const hasScrollytelling = content && content.benefits.length > 0 && content.conditions.length > 0;
  const hasPreContent = Boolean(
    content &&
      (story.length > 0 ||
        hasScrollytelling ||
        content.benefits.length > 0 ||
        content.conditions.length > 0 ||
        content.ingredients.length > 0),
  );
  const hasPostContent = Boolean(
    content &&
      (content.directions !== "" ||
        content.caution !== "" ||
        content.faqs.length > 0),
  );

  return (
    <>
      <Section className="bg-[color:var(--surface)]">
        <Reveal>
          <Link to="/products" className="eyebrow text-muted-foreground sm:hover:text-primary">
            ← All products
          </Link>
        </Reveal>

        {/* Phones only. A phone has one column, so the image is pinned and the
            panel under it advances from the name to the sizes, price and Add to
            cart. From `sm:` upward the two-column block below already shows both
            at once and is left exactly as it was. */}
        <MobileBuyStage
          className="mt-6 sm:hidden"
          images={stageImages}
          fallbackLetter={product.title.charAt(0)}
          title={product.title}
          subtitle={productSubtitle(product)}
          price={priceRangeLabel(product)}
          sizes={displaySizes}
        >
          <AddToCart product={product} />
        </MobileBuyStage>

        <div className="mt-8 grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal className="hidden sm:block">
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
            <div className="hidden sm:block">
              <p className="eyebrow text-[color:var(--gold)]">Product</p>
              <h1 className="mt-4 text-[2rem] leading-tight text-foreground sm:text-4xl lg:text-5xl">
                {product.title}
              </h1>
              <p className="mt-3 font-display text-xl text-[color:var(--burgundy)] font-medium">
                {productSubtitle(product)}
              </p>
            </div>
            <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-muted-foreground">
              {product.description}
            </p>
            <dl className="mt-8 grid max-w-md grid-cols-2 gap-6 text-sm">
              {displaySizes.length > 0 && (
                <div>
                  <dt className="eyebrow text-muted-foreground">Sizes</dt>
                  <dd className="mt-1 text-foreground">{displaySizes.join(" · ")}</dd>
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
              {/* The phone stage already carries these controls. */}
              <div className="hidden sm:block">
                <AddToCart product={product} />
              </div>
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

      {/* Everything the admin panel holds about this product. Each block renders
          only when it has rows, so a product with no record keeps the plain
          template above and nothing here breaks. */}
      {hasPreContent && content ? (
        <Section className="bg-[color:var(--surface)]">
          {story.length > 0 ? (
            <Reveal className="mt-14 first:mt-0">
              <h2 className="text-3xl text-foreground">About this product</h2>
              <div className="mt-5 max-w-3xl space-y-4 text-[15px] leading-relaxed text-muted-foreground">
                {story.map((part) => (
                  <p key={part}>{part}</p>
                ))}
              </div>
            </Reveal>
          ) : null}

          {hasScrollytelling ? (
            <div className="mt-14 w-full md:h-[200vh] relative -mx-4 sm:-mx-6 lg:-mx-8">
              <div className="hidden md:block">
                <DesktopScrollytelling
                  bottleSrc={stageImages[0]?.src || ""}
                  bottleAlt={stageImages[0]?.alt || ""}
                  howItHelpsTitle={content.breakthroughTitle || "How it helps"}
                  benefits={content.benefits || []}
                  whereToApplyTitle={content.indicationsTitle || "Where to apply"}
                  conditions={content.conditions || []}
                />
              </div>
              <div className="block md:hidden">
                <MobileScrollytelling
                  bottleSrc={stageImages[0]?.src || ""}
                  bottleAlt={stageImages[0]?.alt || ""}
                  howItHelpsTitle={content.breakthroughTitle || "How it helps"}
                  benefits={content.benefits || []}
                  whereToApplyTitle={content.indicationsTitle || "Where to apply"}
                  conditions={content.conditions || []}
                />
              </div>
            </div>
          ) : (
            <>
              {content.benefits.length > 0 ? (
                <Reveal className="mt-14 first:mt-0">
                  <h2 className="text-3xl text-foreground">Key benefits</h2>
                  <ul className="mt-6 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2">
                    {content.benefits.map((b) => (
                      <li key={b.title} className="bg-card p-6">
                        <p className="text-lg text-foreground">{b.title}</p>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{b.body}</p>
                      </li>
                    ))}
                  </ul>
                </Reveal>
              ) : null}

              {content.conditions.length > 0 ? (
                <Reveal className="mt-14 first:mt-0">
                  <h2 className="text-3xl text-foreground">Where it is used</h2>
                  <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {content.conditions.map((c) => {
                      const Icon = resolveIcon(c.icon);
                      return (
                        <article
                          key={c.title}
                          className="flex h-full flex-col rounded-2xl border border-border bg-card p-6"
                        >
                          <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[color:var(--botanical)]/10">
                            <Icon className="h-5 w-5 text-[color:var(--botanical)]" />
                          </span>
                          <h3 className="mt-5 text-lg leading-tight text-foreground">{c.title}</h3>
                          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.body}</p>
                        </article>
                      );
                    })}
                  </div>
                </Reveal>
              ) : null}
            </>
          )}
          {content.ingredients.length > 0 ? (
            <Reveal className="mt-14 first:mt-0">
              <h2 className="text-3xl text-foreground">Formulation</h2>
              <ul className="mt-6 divide-y divide-border border-t border-border">
                {content.ingredients.map((i) => (
                  <li key={i.name} className="grid grid-cols-[1fr_1.2fr_auto] gap-3 py-3 text-sm">
                    <span className="font-medium text-foreground">{i.name}</span>
                    <span className="text-muted-foreground italic">{i.latin}</span>
                    <span className="text-muted-foreground">{i.part}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          ) : null}
        </Section>
      ) : null}

      {/* SECTION: FOUR SIMPLE STEPS (Stacked card deck on mobile, static grid on desktop) */}
      <StickySteps
        steps={content?.steps && content.steps.length > 0 ? content.steps : undefined}
        eyebrow="SIMPLE APPLICATION"
        title="Four simple steps"
        subtitle="Gentle, touch-free wound care engineered for rapid recovery and soothing comfort."
      />

      {hasPostContent && content ? (
        <Section className="bg-[color:var(--surface)]">
          {content.directions !== "" || content.caution !== "" ? (
            <Reveal className="grid gap-6 sm:grid-cols-2">
              {content.directions !== "" ? (
                <div className="rounded-lg border border-border bg-card p-7">
                  <h3 className="text-lg text-foreground">Directions for use</h3>
                  <p className="mt-3 text-sm leading-relaxed whitespace-pre-line text-muted-foreground">
                    {content.directions}
                  </p>
                </div>
              ) : null}
              {content.caution !== "" ? (
                <div className="rounded-lg border border-[color:var(--burgundy)]/30 bg-card p-7">
                  <h3 className="text-lg text-foreground">Caution</h3>
                  <p className="mt-3 text-sm leading-relaxed whitespace-pre-line text-[color:var(--burgundy)]">
                    {content.caution}
                  </p>
                </div>
              ) : null}
            </Reveal>
          ) : null}

          {content.faqs.length > 0 ? (
            <Reveal className="mt-14 first:mt-0">
              <h2 className="text-3xl text-foreground">Questions about this product</h2>
              <Accordion type="single" collapsible className="mt-4 w-full max-w-3xl">
                {content.faqs.map((f, i) => (
                  <AccordionItem key={f.q} value={`item-${i}`}>
                    <AccordionTrigger className="text-left font-display text-lg">
                      {f.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                      {f.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Reveal>
          ) : null}
        </Section>
      ) : null}

      <Section>
        {product.variants.length > 1 && (
          <>
            <Reveal>
              <SectionLabel index="02" label="Sizes" />
              <h2 className="mt-6 text-3xl text-foreground">Available sizes</h2>
            </Reveal>
            <div className="mt-8 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-6 sm:grid sm:grid-cols-2 sm:overflow-x-visible sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0">
              {product.variants.map((v, i) => (
                <div key={v.id} className="w-[85vw] shrink-0 snap-center sm:w-auto">
                  <Reveal delay={i * 0.06} className="h-full">
                    <div className="h-full rounded-lg border border-border bg-card p-7">
                      <h3 className="text-2xl text-foreground">
                        {variantLabel(v.title) ||
                          (isSolidermaHandle(product.handle) ? "50ml Spray Bottle" : "Standard Pack")}
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {v.availableForSale ? "In stock" : "Out of stock"}
                      </p>
                      <p className="mt-4 font-display text-lg text-foreground">
                        {formatMoney(v.price)}
                      </p>
                    </div>
                  </Reveal>
                </div>
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

import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowDown,
  BadgeCheck,
  FlaskConical,
  HeartPulse,
  Leaf,
  Quote,
  ShieldCheck,
  Sparkles,
  Stethoscope,
} from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { SectionLabel, Note } from "@/components/site/Section";
import { Blob } from "@/components/site/Blob";
import { Stars } from "@/components/site/Stars";
import { CardAddToCart } from "@/components/site/AddToCart";
import { imageAlt, priceRangeLabel, sizedImage, variantLabel } from "@/lib/shopify/format";
import { productsQuery } from "@/lib/shopify/queryOptions";
import { TESTIMONIALS, WA_ENQUIRY } from "@/lib/site";

export const Route = createFileRoute("/products/")({
  loader: async ({ context }) => ({
    products: await context.queryClient.ensureQueryData(productsQuery(24)),
  }),
  head: () => ({
    meta: [
      { title: "Products & Formulations | Vallalaar Remedies" },
      {
        name: "description",
        content:
          "Explore the complete Vallalaar Remedies range — pure Ayurvedic formulations backed by science, trusted by doctors, and manufactured under WHO-GMP standards.",
      },
      { property: "og:title", content: "All Products — Vallalaar Remedies" },
      {
        property: "og:description",
        content: "Pure Ayurvedic healthcare & wound-care formulations from Chennai.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProductsIndex,
});

const WHY_CHOOSE_PILLARS = [
  {
    icon: Leaf,
    title: "100% Herbal & Safe",
    body: "Formulated with documented Ayurvedic botanicals. Free from harsh steroids, parabens, or harmful chemicals.",
  },
  {
    icon: Stethoscope,
    title: "Doctor & Clinic Trusted",
    body: "Used and recommended by healthcare practitioners as an integral part of modern wound-care routines.",
  },
  {
    icon: FlaskConical,
    title: "Clinically Researched",
    body: "Developed through careful botanical science and refined through documented clinical feedback and patient care.",
  },
  {
    icon: BadgeCheck,
    title: "WHO-GMP Certified",
    body: "Manufactured under strict WHO-GMP sterile conditions, AYUSH compliant, and rigorously batch-tested for quality.",
  },
];

function ProductsIndex() {
  const { products } = Route.useLoaderData();

  return (
    <>
      {/* ===============================================================
          01 HERO: WHY CHOOSE VALLALAAR REMEDIES
          =============================================================== */}
      <section className="relative isolate overflow-hidden bg-[color:var(--surface)] px-5 pt-12 pb-16 sm:px-6 sm:pt-16 sm:pb-20 lg:pt-20 lg:pb-24 border-b border-border/80">
        <Blob
          variant={1}
          className="-right-36 -top-24 hidden h-[480px] w-[480px] -z-10 sm:block"
          color="var(--botanical)"
          opacity={0.12}
        />
        <Blob
          variant={2}
          className="-left-36 -bottom-24 hidden h-[440px] w-[440px] -z-10 sm:block"
          color="var(--gold)"
          opacity={0.09}
        />

        <div className="mx-auto max-w-6xl">
          {/* Top Headline & Value Prop */}
          <Reveal className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full bg-[color:var(--botanical)]/12 px-3.5 py-1 text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--botanical)]">
              <span>Why Choose Vallalaar</span>
            </div>

            <h1 className="mt-4 font-serif text-[2.2rem] sm:text-4xl lg:text-5xl font-normal leading-[1.12] tracking-tight text-foreground">
              Pure Ayurvedic Formulations.<br className="hidden sm:inline" />
              <span className="text-[color:var(--burgundy)]"> Backed by Modern Science.</span>
            </h1>

            <p className="mt-3.5 text-sm sm:text-base leading-relaxed text-muted-foreground max-w-2xl mx-auto">
              We bridge timeless botanical remedies with certified WHO-GMP manufacturing to deliver touch-free, doctor-recommended healthcare and wound-care solutions for the whole family.
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <a
                href="#catalogue"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-sm transition-transform duration-300 hover:-translate-y-0.5 hover:bg-[color:var(--botanical-deep)]"
              >
                Explore Products <ArrowDown className="h-4 w-4" />
              </a>
              <a
                href={WA_ENQUIRY}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-border bg-card px-5 text-sm font-semibold text-foreground shadow-sm transition-colors hover:border-[color:var(--gold)]"
              >
                Consult a Care Expert
              </a>
            </div>
          </Reveal>

          {/* 4 Pillars Grid: Why Choose Us */}
          <div className="mt-12 grid gap-5 sm:mt-16 sm:grid-cols-2 lg:grid-cols-4">
            {WHY_CHOOSE_PILLARS.map((p, i) => {
              const Icon = p.icon;
              return (
                <Reveal key={p.title} delay={i * 0.08}>
                  <div className="flex h-full flex-col items-start rounded-2xl border border-border bg-card/90 p-5 sm:p-6 shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-[color:var(--gold)]/70 hover:shadow-md">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-[color:var(--botanical)]/20 bg-[color:var(--ivory)] text-[color:var(--botanical)] shadow-sm">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="mt-4 font-serif text-lg font-bold text-foreground leading-tight">
                      {p.title}
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                      {p.body}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===============================================================
          02 PRODUCTS LIST (CATALOGUE)
          =============================================================== */}
      <section id="catalogue" className="bg-[color:var(--surface)] px-5 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <div className="flex items-center gap-2">
              <SectionLabel index="01" label="Catalogue" />
            </div>
            <h2 className="mt-4 font-serif text-[2rem] sm:text-4xl font-normal leading-tight text-foreground">
              The Complete Vallalaar Range
            </h2>
            <p className="mt-2.5 max-w-xl text-sm sm:text-base leading-relaxed text-muted-foreground">
              Herbal formulations crafted with botanical precision. Add to cart and check out securely.
            </p>
          </Reveal>

          {products.length === 0 ? (
            <p className="mt-12 rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
              Our catalogue is being updated. Please check back shortly.
            </p>
          ) : (
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((p, i) => {
                const sizes = p.variants
                  .map((v) => variantLabel(v.title))
                  .filter((label) => label !== "")
                  .join(" · ");

                return (
                  <Reveal key={p.handle} delay={i * 0.06}>
                    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:border-[color:var(--gold)] hover:shadow-md">
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
                          <h3 className="text-2xl text-foreground font-serif transition-colors group-hover:text-[color:var(--burgundy)]">
                            {p.title}
                          </h3>
                        </Link>

                        {p.productType && (
                          <p className="mt-1 text-sm text-[color:var(--burgundy)] font-medium">
                            {p.productType}
                          </p>
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

          <div className="mt-8">
            <Note>
              Ayurvedic proprietary medicine. Use as directed. Consult a qualified practitioner for deep,
              infected or non-healing wounds.
            </Note>
          </div>
        </div>
      </section>

      {/* ===============================================================
          03 TESTIMONIALS
          =============================================================== */}
      <section id="testimonials" className="border-t border-border bg-[color:var(--surface)] px-5 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <Reveal className="text-center sm:text-left">
            <SectionLabel index="02" label="Testimonials" />
            <h2 className="mt-4 font-serif text-[2rem] sm:text-4xl font-normal leading-tight text-foreground">
              Real Stories. Real Results.
            </h2>
            <p className="mt-2 max-w-xl text-sm sm:text-base leading-relaxed text-muted-foreground">
              Read how patients, families and healthcare practitioners experience the healing power of Vallalaar Remedies.
            </p>
          </Reveal>

          <div className="mt-8 grid gap-5 sm:mt-12 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={t.name} delay={i * 0.06}>
                <figure className="flex h-full flex-col rounded-2xl border border-border bg-card p-5 sm:p-7 transition-all duration-300 hover:border-[color:var(--gold)]/60 hover:shadow-md">
                  <Quote className="h-6 w-6 text-[color:var(--botanical)]/25 sm:h-7 sm:w-7" />
                  <Stars rating={t.rating} className="mt-3 sm:mt-4" />
                  <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground sm:mt-4">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <figcaption className="mt-5 border-t border-border pt-4 sm:mt-6">
                    <p className="font-display text-base text-foreground font-semibold">{t.name}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{t.role}</p>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>

          <Note>
            Testimonials are published only with appropriate consent. Individual results vary — this
            is not a substitute for professional medical advice.
          </Note>
        </div>
      </section>
    </>
  );
}

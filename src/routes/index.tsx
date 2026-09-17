import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  ArrowRight,
  BadgeCheck,
  Droplet,
  FlaskConical,
  Leaf,
  MessageCircle,
  Microscope,
  Phone,
  Quote,
  ShieldCheck,
  Sparkles,
  Stethoscope,
} from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { Section, SectionLabel, Note } from "@/components/site/Section";
import { Blob } from "@/components/site/Blob";
import { ProductRange } from "@/components/site/ProductRange";
import { AddToCart } from "@/components/site/AddToCart";
import { MobileStackedIndications } from "@/components/site/MobileStackedIndications";
import { Stars } from "@/components/site/Stars";
import { featuredProductsQuery } from "@/lib/shopify/queryOptions";
import { sharedContentQuery } from "@/lib/content/queryOptions";
import { iconRows } from "@/lib/content/render";
import { isSolidermaHandle, sizedImage, imageAlt } from "@/lib/shopify/format";
import {
  CERTIFICATIONS,
  CONDITIONS,
  GUIDES,
  PHONE_DISPLAY,
  PHONE_TEL,
  PRO_POINTS,
  TESTIMONIALS,
  WA_CLINIC,
  WA_ENQUIRY,
} from "@/lib/site";
import hero from "@/assets/hero.jpeg";
import bottle from "@/assets/soliderma-bottle.png";
import forestHero from "@/assets/forest-hero.jpg";

const HERO_BADGES = [
  { icon: ShieldCheck, label: "WHO-GMP" },
  { icon: Leaf, label: "AYUSH" },
  { icon: Microscope, label: "Clinically Researched" },
];

const PILLARS = [
  {
    icon: Leaf,
    title: "Expedited Healing",
    body: "Uses powerful plant-based ingredients to help your skin heal naturally and rebuild healthy tissue.",
  },
  {
    icon: Activity,
    title: "Enhanced Microcirculation",
    body: "Improves blood flow and oxygen to the wound area, delivering the vital nutrients needed for faster healing.",
  },
  {
    icon: ShieldCheck,
    title: "Antimicrobial Safeguard",
    body: "Supports robust defense against microbial burden and infection progression.",
  },
  {
    icon: Sparkles,
    title: "Scar Modulation",
    body: "Supports the skin's natural repair process to help minimize the appearance of scars over time.",
  },
];


/** Home shows the first three; /clinics lists all of them. */
const HOME_PRO_POINTS = PRO_POINTS.slice(0, 3);

export const Route = createFileRoute("/")({
  loader: async ({ context }) => {
    // One source of truth: a product that is not yet sellable in Shopify (zero
    // stock / unpublished variants) renders in the "Coming Soon" tier below.
    //
    // The cap is generous rather than three, because past three the range renders
    // as an auto-advancing rail — a fourth product added in Shopify has to reach
    // the page for that to mean anything.
    const [products, shared] = await Promise.all([
      context.queryClient.ensureQueryData(featuredProductsQuery(12)),
      context.queryClient.ensureQueryData(sharedContentQuery()),
    ]);
    return {
      featured: products.filter((p) => p.availableForSale).slice(0, 8),
      upcoming: products.filter((p) => !p.availableForSale).slice(0, 2),
      shared,
    };
  },
  head: () => ({
    meta: [
      { title: "Vallalaar Remedies | Ayurvedic Healthcare & Wound Care" },
      {
        name: "description",
        content:
          "Vallalaar Remedies is an Ayurvedic healthcare brand from Chennai. WHO-GMP manufactured herbal formulations for wound care, supported by product training and clinical supply for professionals.",
      },
      {
        property: "og:title",
        content: "Trusted Care. Better Every Day. | Vallalaar Remedies",
      },
      {
        property: "og:description",
        content:
          "Safe, effective, researched. Backed by nature. Trusted by professionals. Explore the Vallalaar Remedies range.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  const { featured, upcoming, shared } = Route.useLoaderData();
  const certifications = iconRows(shared?.certifications ?? [], CERTIFICATIONS);

  const solidermaProduct =
    featured.find((p) => isSolidermaHandle(p.handle)) ?? featured[0] ?? null;
  const bottleSrc = solidermaProduct?.featuredImage
    ? sizedImage(solidermaProduct.featuredImage.url, 1200)
    : bottle;
  const bottleAlt = solidermaProduct
    ? imageAlt(solidermaProduct.featuredImage?.altText ?? null, solidermaProduct)
    : "SOLIDERMA Multi-Action Wound Healing Spray Bottle";

  return (
    <>
      {/* 01 HERO — Full width editorial backdrop */}
      <section className="relative isolate flex min-h-[90vh] sm:min-h-[92vh] flex-col justify-between overflow-hidden bg-[color:var(--ivory)] pt-14 sm:pt-16 pb-0">
        {/* Hero Background Image from src/assets/hero.jpeg */}
        <img
          src={hero}
          alt="Ayurvedic herbs, mortar and pestle background"
          width={1920}
          height={1080}
          className="absolute inset-0 -z-20 h-full w-full object-cover object-[center_right] sm:object-center"
        />

        {/* Subtle translucent wash so hero.jpeg is richly visible with crisp text contrast on mobile & desktop */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-r from-[color:var(--ivory)]/95 via-[color:var(--ivory)]/85 to-[color:var(--ivory)]/70 sm:from-[color:var(--ivory)]/65 sm:via-[color:var(--ivory)]/25 sm:to-transparent"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-b from-[color:var(--ivory)]/70 via-transparent to-[color:var(--ivory)]/80 sm:from-[color:var(--ivory)]/30 sm:to-[color:var(--ivory)]/60"
        />

        <div className="mx-auto flex w-full max-w-7xl flex-1 items-center px-4 pt-5 pb-4 sm:px-6 sm:pt-8 sm:pb-6 lg:pt-8 lg:pb-6">
          <div className="grid w-full grid-cols-1 items-center gap-6 lg:grid-cols-12 lg:gap-8">
            {/* LEFT COLUMN: Value Proposition, Mobile Product stage, 4 Feature Badges & CTA */}
            <div
              className="flex flex-col items-start text-left lg:col-span-7"
            >
              {/* Category Pill Badge */}
              <div className="inline-flex items-center gap-2 rounded-full bg-[color:var(--botanical)]/12 px-3 py-0.5 text-[10.5px] sm:text-[11px] font-bold uppercase tracking-[0.16em] text-[color:var(--botanical)]">
                <span>The Pinnacle of Herbal Wound Science</span>
              </div>

              {/* Main Headline */}
              <h1 className="mt-3 sm:mt-5 font-serif tracking-tight text-foreground">
                <span className="block text-3xl sm:text-5xl lg:text-6xl font-bold text-[color:var(--burgundy)] mb-3 sm:mb-4">
                  SOLIDERMA
                </span>{" "}
                <span className="block text-xl sm:text-3xl lg:text-4xl font-medium leading-snug text-foreground/90">
                  Multi-Action Wound Healing Spray Crafted for Precision Healing
                </span>
              </h1>

              {/* Description Subtitle */}
              <p className="mt-3 sm:mt-4 max-w-xl text-xs sm:text-base leading-relaxed text-foreground/80">
                SOLIDERMA combines traditional Ayurvedic herbs with modern spray technology for effective, hassle-free wound care. Our formula helps speed up skin healing, improves blood flow, protects against infection, and reduces scarring—giving you a reliable, natural way to heal.
              </p>

              {/* MOBILE ONLY: Product Bottle Stage */}
              <div className="flex w-full items-center justify-center lg:hidden my-4 py-2">
                <Link
                  to="/soliderma"
                  className="group relative flex flex-col items-center shrink-0 cursor-pointer transition-transform duration-300 hover:scale-105"
                >
                  <img
                    src={bottleSrc}
                    alt={bottleAlt}
                    width={350}
                    height={460}
                    className="h-[200px] sm:h-[260px] w-auto object-contain drop-shadow-[0_14px_28px_rgba(0,0,0,0.18)]"
                  />
                  <div className="-mt-1 mx-auto h-2 w-20 sm:w-24 rounded-full bg-black/15 blur-sm" />
                </Link>
              </div>

              {/* Action Buttons */}
              <div className="mt-3 sm:mt-7 flex flex-wrap gap-2.5 w-full sm:flex sm:w-auto sm:items-center sm:gap-3">
                <Link
                  to="/soliderma"
                  className="inline-flex min-h-10 sm:min-h-11 items-center justify-center gap-1.5 sm:gap-2 rounded-full bg-[color:var(--botanical-deep)] hover:bg-[color:var(--botanical)] px-5 sm:px-7 text-xs sm:text-sm font-semibold text-white shadow-md transition-transform duration-300 hover:-translate-y-0.5 text-center"
                >
                  Get Soliderma <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </Link>

                <a
                  href={WA_ENQUIRY}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-10 sm:min-h-11 items-center justify-center gap-1.5 sm:gap-2 rounded-full border border-[color:var(--burgundy)]/30 bg-card/90 hover:bg-card px-3 sm:px-6 text-xs sm:text-sm font-semibold text-[color:var(--burgundy)] shadow-sm backdrop-blur-sm transition-colors text-center"
                >
                  <MessageCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                  <span className="truncate">Talk to Expert</span>
                </a>
              </div>
            </div>

            {/* DESKTOP ONLY RIGHT COLUMN: Product Bottle Presentation */}
            <div
              className="hidden lg:flex flex-col items-center justify-center lg:col-span-5"
            >
              {/* Product Bottle with soft shadow */}
              <div className="relative flex flex-col items-center">
                <Link
                  to="/soliderma"
                  className="group block cursor-pointer transition-transform duration-500 hover:scale-105"
                >
                  <img
                    src={bottleSrc}
                    alt={bottleAlt}
                    width={700}
                    height={920}
                    className="h-[340px] sm:h-[400px] lg:h-[460px] xl:h-[500px] w-auto object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.2)] transition-transform duration-500"
                  />
                  <div className="-mt-2 mx-auto h-3.5 w-32 rounded-full bg-black/15 blur-sm" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* TRUST & CERTIFICATIONS STRIP */}
        <div className="mt-auto w-full border-t border-border/70 bg-card/90 backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl flex-col sm:flex-row items-center justify-between gap-2.5 px-4 py-2.5 sm:px-6 sm:py-3">
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 w-full sm:w-auto sm:flex sm:flex-wrap sm:items-center sm:gap-6 lg:gap-8">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-full border border-[color:var(--gold)]/40 bg-[color:var(--ivory)] text-[color:var(--botanical)]">
                  <ShieldCheck className="h-3 sm:h-3.5 w-3 sm:w-3.5" />
                </span>
                <div>
                  <p className="text-[10.5px] sm:text-[11px] font-bold uppercase tracking-wider text-foreground leading-tight">WHO-GMP</p>
                  <p className="text-[9px] sm:text-[9.5px] text-muted-foreground leading-tight">Manufacturing</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-full border border-[color:var(--gold)]/40 bg-[color:var(--ivory)] text-[color:var(--botanical)]">
                  <Leaf className="h-3 sm:h-3.5 w-3 sm:w-3.5" />
                </span>
                <div>
                  <p className="text-[10.5px] sm:text-[11px] font-bold uppercase tracking-wider text-foreground leading-tight">AYUSH</p>
                  <p className="text-[9px] sm:text-[9.5px] text-muted-foreground leading-tight">Compliant</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-full border border-[color:var(--gold)]/40 bg-[color:var(--ivory)] text-[color:var(--botanical)]">
                  <BadgeCheck className="h-3 sm:h-3.5 w-3 sm:w-3.5" />
                </span>
                <div>
                  <p className="text-[10.5px] sm:text-[11px] font-bold uppercase tracking-wider text-foreground leading-tight">ISO 9001:2015</p>
                  <p className="text-[9px] sm:text-[9.5px] text-muted-foreground leading-tight">Certified</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-full border border-[color:var(--gold)]/40 bg-[color:var(--ivory)] text-[color:var(--botanical)]">
                  <FlaskConical className="h-3 sm:h-3.5 w-3 sm:w-3.5" />
                </span>
                <div>
                  <p className="text-[10.5px] sm:text-[11px] font-bold uppercase tracking-wider text-foreground leading-tight">Batch Tested</p>
                  <p className="text-[9px] sm:text-[9.5px] text-muted-foreground leading-tight">for Quality</p>
                </div>
              </div>
            </div>

            <Link
              to="/about"
              className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold text-[color:var(--botanical)] hover:text-[color:var(--botanical-deep)] transition-colors pt-0.5 sm:pt-0"
            >
              <Leaf className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              <span>Ayurveda for a Healthier Tomorrow</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </section>

      {/* 02 WHY CHOOSE US */}
      <Section className="border-b border-border/70">
        <Reveal className="text-center">
          <div className="flex justify-center">
            <SectionLabel index="02" label="Why Choose Us" />
          </div>
          <h2 className="mt-5 text-[1.75rem] leading-tight text-foreground sm:mt-6 sm:text-4xl">
            Why Thousands Trust Us
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:mt-4 sm:text-[15px]">
            Pure Ayurvedic formulations manufactured under WHO-GMP conditions, backed by science and clinical practice.
          </p>
        </Reveal>
        <div className="mt-8 grid gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {PILLARS.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.06}>
              <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-5 sm:p-7 transition-transform duration-300 sm:hover:-translate-y-1 shadow-sm">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[color:var(--botanical)]/10 text-[color:var(--botanical)] sm:h-12 sm:w-12">
                  <f.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-lg font-semibold text-foreground sm:mt-5 sm:text-xl">{f.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* 03 CLINICAL INDICATIONS */}
      <Section className="border-b border-border/70 bg-[color:var(--surface)]">
        <Reveal className="text-left sm:text-center">
          <div className="flex sm:justify-center">
            <SectionLabel index="03" label="Clinical Indications" />
          </div>
          <h2 className="mt-2 font-serif text-2xl leading-tight text-foreground sm:mt-6 sm:text-4xl">
            Indications for Complex Wounds That Demand More
          </h2>
          <p className="mt-2 max-w-2xl text-xs leading-relaxed text-muted-foreground sm:mx-auto sm:mt-4 sm:text-[15px]">
            SOLIDERMA is formulated for complex wounds that need ongoing, daily care, helping the skin progress steadily through every stage of healing.
          </p>
        </Reveal>
        <MobileStackedIndications conditions={CONDITIONS} />

        {/* Desktop Layout */}
        <div className="hidden sm:mt-12 sm:grid sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {CONDITIONS.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.05}>
              <div className="flex w-full flex-col rounded-2xl border border-border bg-card p-6 transition-all hover:border-[color:var(--botanical)]/40 hover:shadow-md h-full">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[color:var(--botanical)]/10 text-[color:var(--botanical)]">
                    <c.icon className="h-5 w-5" />
                  </span>
                  <h3 className="font-serif text-lg font-semibold text-foreground">{c.title}</h3>
                </div>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {c.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
        <Note>
          For significant, infected, deep, diabetic or otherwise serious wounds, users should seek appropriate professional medical care.
        </Note>
      </Section>

      {/* 04 OUR RANGE / PRODUCT */}
      <section
        id="products"
        className="relative isolate overflow-hidden bg-background px-5 py-10 sm:px-6 sm:py-14"
      >
        <Blob
          variant={1}
          className="-right-40 top-10 hidden h-[420px] w-[420px] -z-10 sm:block"
          color="var(--botanical)"
          opacity={0.12}
        />
        <div className="mx-auto max-w-6xl">
          <Reveal className="text-center">
            <div className="flex justify-center">
              <SectionLabel index="04" label="Our Range" />
            </div>
            <h2 className="mt-5 text-[1.75rem] leading-tight text-foreground sm:mt-6 sm:text-4xl">
              Find your care product
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:mt-4 sm:text-[15px]">
              Add to cart and check out securely. More formulations are on the way.
            </p>
          </Reveal>

          {featured.length === 0 && upcoming.length === 0 ? (
            <p className="mt-8 rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground sm:mt-12">
              Our catalogue is being updated. Please check back shortly.
            </p>
          ) : (
            <ProductRange products={featured} />
          )}

          {upcoming.length > 0 && (
            <div className="mt-5 grid gap-5 sm:mt-6 sm:grid-cols-2 sm:gap-6">
              {upcoming.map((p, i) => (
                <Reveal key={p.handle} delay={i * 0.06}>
                  <Link
                    to="/products/$slug"
                    params={{ slug: p.handle }}
                    className="group flex h-full flex-col items-start gap-4 rounded-2xl border border-dashed border-border p-5 transition-colors sm:flex-row sm:items-center sm:p-7 sm:hover:border-[color:var(--gold)]"
                  >
                    <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[color:var(--botanical)]/8">
                      <Sparkles className="h-5 w-5 text-[color:var(--botanical)]/60" />
                    </span>
                    <div className="flex-1 self-stretch">
                      <p className="eyebrow text-muted-foreground">Coming Soon</p>
                      <h3 className="mt-2 text-lg text-foreground transition-colors sm:group-hover:text-[color:var(--burgundy)]">
                        {p.title}
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        {p.description}
                      </p>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 05 TESTIMONIALS */}
      <section
        id="testimonials"
        className="border-y border-border bg-[color:var(--surface)] px-5 py-16 sm:px-6 sm:py-24"
      >
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <SectionLabel index="05" label="Testimonials" />
            <h2 className="mt-5 text-[1.75rem] leading-tight text-foreground sm:mt-6 sm:text-4xl">
              Real Stories. Real Results.
            </h2>
          </Reveal>
          <div className="-mx-5 mt-8 flex items-stretch snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 sm:mx-0 sm:mt-12 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={t.name} delay={i * 0.06} className="flex w-[85vw] max-w-[340px] shrink-0 snap-center sm:w-auto sm:max-w-none sm:shrink sm:snap-align-none">
                <figure className="flex w-full flex-col rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:border-[color:var(--botanical)]/40 hover:shadow-md sm:p-7">
                  <Quote className="h-6 w-6 text-[color:var(--botanical)]/25 sm:h-7 sm:w-7" />
                  <Stars rating={t.rating} className="mt-3 sm:mt-4" />
                  <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground sm:mt-4">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <figcaption className="mt-5 border-t border-border pt-4 sm:mt-6">
                    <p className="font-display text-base text-foreground">{t.name}</p>
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


      {/* 07 FOR PROFESSIONALS */}
      <section className="border-y border-border bg-[color:var(--surface)] px-5 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-8 sm:gap-14 lg:grid-cols-2">
          <Reveal delay={0.1} className="lg:order-2">
            <SectionLabel index="07" label="For Professionals" />
            <h2 className="mt-5 text-[1.75rem] leading-tight text-foreground sm:mt-6 sm:text-4xl">
              For Healthcare Professionals
            </h2>
            <ul className="mt-7 space-y-5 sm:mt-9 sm:space-y-6">
              {HOME_PRO_POINTS.map((p) => (
                <li key={p.title} className="flex gap-4">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[color:var(--botanical)]/10 sm:h-11 sm:w-11">
                    <p.icon className="h-5 w-5 text-[color:var(--botanical)]" />
                  </span>
                  <div>
                    <h3 className="text-base text-foreground sm:text-lg">{p.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap">
              <Link
                to="/clinics"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-7 text-sm font-medium text-primary-foreground transition-colors hover:bg-[color:var(--botanical-deep)]"
              >
                Partner With Us <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={WA_CLINIC}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[color:var(--botanical)]/40 px-7 text-sm font-medium text-[color:var(--botanical)] transition-colors hover:border-[color:var(--botanical)]"
              >
                <MessageCircle className="h-4 w-4" />
                Bulk Enquiry
              </a>
            </div>
          </Reveal>
          <Reveal className="relative isolate lg:order-1">
            <div className="relative overflow-hidden rounded-2xl sm:rounded-[2rem]">
              <img
                src={forestHero}
                alt="Clinical partnership with Vallalaar Remedies"
                width={1200}
                height={900}
                loading="lazy"
                className="h-[220px] w-full object-cover sm:h-[340px] lg:h-[420px]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--botanical-deep)]/90 to-[color:var(--botanical-deep)]/20" />
              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8">
                <Stethoscope className="h-7 w-7 text-[color:var(--gold)] sm:h-8 sm:w-8" />
                <p className="mt-3 font-display text-xl leading-tight text-[color:var(--ivory)] sm:mt-4 sm:text-2xl">
                  Clinics, hospitals &amp; pharmacies
                </p>
                <p className="mt-2 max-w-sm text-xs leading-relaxed text-[color:var(--ivory)]/75 sm:text-sm">
                  Supply, training and clinical support from one point of contact.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 08 WHATSAPP CTA BANNER */}
      <section className="relative isolate overflow-hidden bg-[color:var(--burgundy)] px-5 py-16 text-center text-primary-foreground sm:px-6 sm:py-24">
        <Blob
          variant={2}
          className="-bottom-40 left-1/2 hidden h-[520px] w-[620px] -translate-x-1/2 -z-10 sm:block"
          color="var(--ivory)"
          opacity={0.08}
        />
        <Reveal>
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-primary-foreground/25 bg-primary-foreground/10 sm:h-14 sm:w-14">
            <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6" />
          </span>
          <h2 className="mx-auto mt-5 max-w-2xl text-[1.75rem] leading-tight sm:mt-7 sm:text-4xl lg:text-[2.75rem]">
            Questions before you order? We&rsquo;re just a WhatsApp message away.
          </h2>
          <div className="mt-7 flex flex-col items-stretch gap-3 sm:mt-9 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center">
            <a
              href={WA_ENQUIRY}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-13 items-center justify-center gap-2 rounded-full bg-primary-foreground px-8 text-sm font-semibold text-[color:var(--burgundy)] transition-transform duration-300 sm:hover:-translate-y-0.5"
            >
              <MessageCircle className="h-4 w-4" />
              Chat on WhatsApp
            </a>
            <a
              href={`tel:${PHONE_TEL}`}
              className="inline-flex min-h-13 items-center justify-center gap-2 rounded-full border border-primary-foreground/50 px-8 text-sm font-medium transition-colors hover:bg-primary-foreground/10"
            >
              <Phone className="h-4 w-4" />
              {PHONE_DISPLAY}
            </a>
          </div>
          <p className="mt-5 text-xs text-primary-foreground/65 sm:mt-6">
            Mon &ndash; Sat, 9 am to 7 pm IST
          </p>
        </Reveal>
      </section>
    </>
  );
}

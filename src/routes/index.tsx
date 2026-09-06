import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  ArrowRight,
  BadgeCheck,
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
import { Stars } from "@/components/site/Stars";
import { featuredProductsQuery } from "@/lib/shopify/queryOptions";
import { sharedContentQuery } from "@/lib/content/queryOptions";
import { iconRows } from "@/lib/content/render";
import {
  ABOUT_SNIPPET,
  CERTIFICATIONS,
  GUIDES,
  metrics,
  PHONE_DISPLAY,
  PHONE_TEL,
  PRO_POINTS,
  TESTIMONIALS,
  WA_CLINIC,
  WA_ENQUIRY,
} from "@/lib/site";
import ingredientsMacro from "@/assets/ingredients-macro.jpg";
import forestHero from "@/assets/forest-hero.jpg";

const HERO_BADGES = [
  { icon: ShieldCheck, label: "WHO-GMP" },
  { icon: Leaf, label: "AYUSH" },
  { icon: Microscope, label: "Clinically Researched" },
];

const PILLARS = [
  { icon: Leaf, title: "Herbal & Safe", body: "An Ayurvedic formulation of documented herbs." },
  {
    icon: Stethoscope,
    title: "Doctor Trusted",
    body: "Used by practitioners as part of wound-care plans.",
  },
  {
    icon: FlaskConical,
    title: "Research & Backed",
    body: "Developed and refined through clinical feedback.",
  },
  {
    icon: BadgeCheck,
    title: "Quality Assured",
    body: "Manufactured under WHO-GMP conditions, batch tested.",
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

const EASE = [0.22, 1, 0.36, 1] as const;

function Home() {
  const { featured, upcoming, shared } = Route.useLoaderData();
  const certifications = iconRows(shared?.certifications ?? [], CERTIFICATIONS);
  const metricsBar = metrics(certifications.length);

  return (
    <>
      {/* 01 HERO — brand-level: copy first, a botanical still, mobile-first spacing */}
      <section className="relative isolate overflow-hidden bg-[color:var(--ivory)]">
        {/* Decorative washes. Kept cheap on phones: one small blob, the rest from sm up. */}
        <Blob
          variant={1}
          className="-left-24 -top-8 h-[320px] w-[320px] -z-10 blur-2xl sm:-left-40 sm:top-10 sm:h-[620px] sm:w-[620px] sm:blur-3xl"
          color="var(--botanical)"
          opacity={0.2}
        />
        <Blob
          variant={3}
          className="-right-40 top-24 hidden h-[560px] w-[560px] -z-10 blur-3xl sm:block"
          color="var(--gold)"
          opacity={0.22}
        />

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="mx-auto max-w-4xl px-5 pt-12 text-center sm:px-6 sm:pt-20"
        >
          <div className="flex items-center justify-center gap-2 sm:gap-3">
            <span className="h-px w-5 bg-[color:var(--gold)] sm:w-8" />
            <p className="eyebrow text-[color:var(--botanical)]">Vallalaar Remedies</p>
            <span className="h-px w-5 bg-[color:var(--gold)] sm:w-8" />
          </div>

          <h1 className="mt-5 text-balance text-[1.75rem] leading-[1.14] text-foreground sm:mt-7 sm:text-[3rem] sm:leading-[1.06] lg:text-[3.75rem]">
            <span className="block">Trusted Care. Better Every Day.</span>
            <span className="block">Bringing Long Term Illness People to Wellness.</span>
          </h1>

          <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground sm:mt-6 sm:max-w-xl sm:text-base">
            Safe, Effective, Researched. Backed by nature. Trusted by professionals.
          </p>

          {/* Stacked full-width taps on a phone; an inline pair from sm up.
              Shopping is the primary action now that checkout is real — WhatsApp
              is the secondary, enquiry-only channel. */}
          <div className="mt-7 flex flex-col gap-3 sm:mt-9 sm:flex-row sm:justify-center">
            <Link
              to="/products"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[color:var(--botanical-deep)] px-7 text-sm font-semibold text-primary-foreground transition-transform duration-300 sm:hover:-translate-y-0.5"
            >
              Explore Products <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={WA_ENQUIRY}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[color:var(--botanical)]/45 bg-card px-7 text-sm font-medium text-[color:var(--botanical-deep)] transition-colors sm:hover:border-[color:var(--botanical)]"
            >
              <MessageCircle className="h-4 w-4" />
              Chat on WhatsApp
            </a>
          </div>

          <ul className="mt-7 flex flex-wrap items-center justify-center gap-2 sm:mt-8">
            {HERO_BADGES.map((b) => (
              <li
                key={b.label}
                className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--gold)]/40 bg-card/70 px-3 py-1.5"
              >
                <b.icon className="h-3.5 w-3.5 shrink-0 text-[color:var(--botanical)]" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground sm:text-[11px] sm:tracking-[0.16em]">
                  {b.label}
                </span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Brand still — the herbs behind the range, not one product. */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: EASE, delay: 0.12 }}
          className="mx-auto mt-10 max-w-5xl px-5 pb-14 sm:mt-14 sm:px-6 sm:pb-20"
        >
          <div className="relative overflow-hidden rounded-2xl sm:rounded-[2rem]">
            <img
              src={ingredientsMacro}
              alt="Turmeric root, aloe vera and dried herbs used in our formulations"
              width={1200}
              height={900}
              className="h-[210px] w-full object-cover sm:h-[320px] lg:h-[400px]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--botanical-deep)]/80 via-[color:var(--botanical-deep)]/15 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8">
              <p className="font-display text-lg leading-tight text-[color:var(--ivory)] sm:text-2xl">
                Ayurvedic formulations, modern quality discipline
              </p>
              <p className="mt-2 max-w-md text-xs leading-relaxed text-[color:var(--ivory)]/75 sm:text-sm">
                Documented herbs, WHO-GMP manufacturing and batch testing behind every product we
                market.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* TRUST & CERTIFICATIONS — same list as /certifications. 3-up even on a phone. */}
      <div className="border-y border-border bg-[color:var(--surface)]">
        <div className="mx-auto grid max-w-6xl grid-cols-3 gap-3 px-5 py-8 sm:gap-6 sm:px-6 sm:py-12">
          {certifications.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.06}>
              <Link
                to="/certifications"
                className="flex h-full flex-col items-center gap-2 text-center transition-transform duration-300 sm:gap-3 sm:hover:-translate-y-1"
              >
                <span className="relative inline-flex h-12 w-12 items-center justify-center rounded-full border border-[color:var(--gold)]/50 bg-[color:var(--ivory)] sm:h-16 sm:w-16">
                  <span className="absolute inset-1 rounded-full border border-dashed border-[color:var(--botanical)]/30" />
                  <c.icon className="h-5 w-5 text-[color:var(--botanical)] sm:h-6 sm:w-6" />
                </span>
                <p className="text-[10px] font-medium uppercase leading-tight tracking-[0.1em] text-muted-foreground sm:text-xs sm:tracking-[0.14em]">
                  {c.title}
                </p>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>

      {/* 02 OUR RANGE */}
      <section
        id="products"
        className="relative isolate overflow-hidden bg-[color:var(--surface)] px-5 py-16 sm:px-6 sm:py-24"
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
              <SectionLabel index="01" label="Our Range" />
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

      {/* 03 WHY CHOOSE US */}
      <Section>
        <Reveal className="text-center">
          <div className="flex justify-center">
            <SectionLabel index="02" label="Why Choose Us" />
          </div>
          <h2 className="mt-5 text-[1.75rem] leading-tight text-foreground sm:mt-6 sm:text-4xl">
            Why Thousands Trust Us
          </h2>
        </Reveal>
        <div className="mt-8 grid gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {PILLARS.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.06}>
              <div className="h-full rounded-2xl border border-border bg-card p-5 transition-transform duration-300 sm:p-7 sm:hover:-translate-y-1">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[color:var(--botanical)]/10 sm:h-12 sm:w-12">
                  <f.icon className="h-5 w-5 text-[color:var(--botanical)]" />
                </span>
                <h3 className="mt-4 text-lg text-foreground sm:mt-5 sm:text-xl">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* 04 TESTIMONIALS */}
      <section
        id="testimonials"
        className="border-y border-border bg-[color:var(--surface)] px-5 py-16 sm:px-6 sm:py-24"
      >
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <SectionLabel index="03" label="Testimonials" />
            <h2 className="mt-5 text-[1.75rem] leading-tight text-foreground sm:mt-6 sm:text-4xl">
              Real Stories. Real Results.
            </h2>
          </Reveal>
          <div className="mt-8 grid gap-5 sm:mt-12 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={t.name} delay={i * 0.06}>
                <figure className="flex h-full flex-col rounded-2xl border border-border bg-card p-5 sm:p-7">
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

      {/* 05 ABOUT SNIPPET + METRICS */}
      <section className="relative isolate overflow-hidden bg-[color:var(--botanical-deep)] px-5 py-16 text-primary-foreground sm:px-6 sm:py-24">
        <Blob
          variant={2}
          className="-left-40 -bottom-32 hidden h-[480px] w-[560px] -z-10 sm:block"
          color="var(--ivory)"
          opacity={0.07}
        />
        <div className="mx-auto max-w-5xl text-center">
          <Reveal>
            <span className="eyebrow text-[color:var(--gold)]">About</span>
            <h2 className="mt-4 text-[1.75rem] leading-tight sm:mt-5 sm:text-4xl">
              About Vallalaar Remedies
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-primary-foreground/75 sm:mt-6 sm:text-[15px]">
              {ABOUT_SNIPPET}
            </p>
            <Link
              to="/about"
              className="mt-6 inline-flex items-center gap-2 border-b border-[color:var(--gold)] pb-1 text-sm font-medium text-[color:var(--gold)] sm:mt-8"
            >
              Read our story <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
        {/* Two columns on a phone — a single column made these read as a long list. */}
        <div className="mx-auto mt-10 grid max-w-5xl grid-cols-2 border-t border-primary-foreground/15 sm:mt-14 lg:grid-cols-4 lg:border-b">
          {metricsBar.map((m, i) => (
            <Reveal
              key={m.label}
              delay={i * 0.06}
              className={i > 0 ? "lg:border-l lg:border-primary-foreground/15" : ""}
            >
              <div className="border-b border-primary-foreground/15 px-3 py-6 text-center sm:px-4 sm:py-7 lg:border-b-0">
                <p className="font-display text-3xl text-[color:var(--gold)] sm:text-4xl">
                  {m.value}
                </p>
                <p className="mt-1.5 text-[10px] font-semibold uppercase leading-tight tracking-[0.12em] text-primary-foreground/70 sm:mt-2 sm:text-[11px] sm:tracking-[0.16em]">
                  {m.label}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 06 WELLNESS GUIDE */}
      <Section>
        <Reveal>
          <SectionLabel index="04" label="Wellness Guide" />
          <div className="mt-5 flex flex-wrap items-end justify-between gap-4 sm:mt-6 sm:gap-6">
            <h2 className="text-[1.75rem] leading-tight text-foreground sm:text-4xl">
              Learn. Care. Stay Healthy.
            </h2>
            <Link
              to="/wound-care"
              className="inline-flex items-center gap-2 text-sm font-medium text-[color:var(--burgundy)]"
            >
              All guides <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
        <div className="mt-8 grid gap-5 sm:mt-12 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {GUIDES.map((g, i) => (
            <Reveal key={g.title} delay={i * 0.06}>
              <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card">
                <div className="h-36 overflow-hidden sm:h-44">
                  <img
                    src={g.image}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <p className="eyebrow text-[color:var(--gold)]">{g.tag}</p>
                  <h3 className="mt-2.5 text-lg leading-tight text-foreground sm:mt-3 sm:text-xl">
                    {g.title}
                  </h3>
                  <p className="mt-2.5 flex-1 text-sm leading-relaxed text-muted-foreground sm:mt-3">
                    {g.body}
                  </p>
                  <Link
                    to="/wound-care"
                    hash={g.slug}
                    className="mt-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--burgundy)] sm:mt-5"
                  >
                    Read More
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* 07 FOR PROFESSIONALS */}
      <section className="border-y border-border bg-[color:var(--surface)] px-5 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-8 sm:gap-14 lg:grid-cols-2">
          <Reveal delay={0.1} className="lg:order-2">
            <SectionLabel index="05" label="For Professionals" />
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

import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  ArrowRight,
  BadgeCheck,
  FlaskConical,
  HeartPulse,
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
import { AddToCart } from "@/components/site/AddToCart";
import { Stars } from "@/components/site/Stars";
import { PRODUCTS, priceLabel } from "@/lib/products";
import {
  ABOUT_SNIPPET,
  BENEFITS,
  CERTIFICATIONS,
  CONDITIONS,
  GUIDES,
  METRICS,
  PHONE_DISPLAY,
  PHONE_TEL,
  PRO_POINTS,
  TESTIMONIALS,
  WA_CLINIC,
  WA_ORDER,
} from "@/lib/site";
import botanicals from "@/assets/botanicals.jpg";
import bottleBack from "@/assets/soliderma-bottle-back.png";
import bottleFront from "@/assets/soliderma-bottle.png";
import forestHero from "@/assets/forest-hero.jpg";
import ingredientsMacro from "@/assets/ingredients-macro.jpg";

const HERO_BADGES = [
  { icon: ShieldCheck, label: "WHO-GMP" },
  { icon: Leaf, label: "AYUSH" },
  { icon: Microscope, label: "Clinically Researched" },
];

/** Paired positionally with BENEFITS from @/lib/site. */
const BENEFIT_ICONS = [Sparkles, HeartPulse, ShieldCheck, Leaf];

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

const FEATURED = PRODUCTS.filter((p) => p.featured);
const UPCOMING = PRODUCTS.filter((p) => !p.featured).slice(0, 2);

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Soliderma by Vallalaar Remedies | Trusted Ayurvedic Wound Care" },
      {
        name: "description",
        content:
          "Soliderma multi action wound healing spray by Vallalaar Remedies — a WHO-GMP manufactured herbal wound-care formulation for diabetic wounds, bed sores, burns and post-surgical care.",
      },
      {
        property: "og:title",
        content: "Trusted Care. Better Every Day. | Vallalaar Remedies",
      },
      {
        property: "og:description",
        content:
          "Safe, effective, researched. Backed by nature. Trusted by professionals. Order Soliderma on WhatsApp.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const EASE = [0.22, 1, 0.36, 1] as const;

function Home() {
  return (
    <>
      {/* 01 HERO — centred composition: headline, CTA pill, trust line, product still-life */}
      <section className="relative isolate overflow-hidden bg-[color:var(--ivory)]">
        <Blob
          variant={1}
          className="-left-40 top-10 h-[620px] w-[620px] -z-10 blur-3xl"
          color="var(--botanical)"
          opacity={0.22}
        />
        <Blob
          variant={3}
          className="-right-40 top-24 h-[560px] w-[560px] -z-10 blur-3xl"
          color="var(--gold)"
          opacity={0.22}
        />
        <Blob
          variant={2}
          className="-right-24 bottom-0 h-[420px] w-[420px] -z-10 blur-3xl"
          color="var(--burgundy)"
          opacity={0.08}
        />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: EASE }}
          className="mx-auto max-w-4xl px-6 pt-16 text-center sm:pt-20"
        >
          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-[color:var(--gold)]" />
            <p className="eyebrow text-[color:var(--botanical)]">
              Soliderma &middot; Vallalaar Remedies
            </p>
            <span className="h-px w-8 bg-[color:var(--gold)]" />
          </div>

          <h1 className="mt-7 text-[2.5rem] leading-[1.06] text-foreground sm:text-[3.75rem]">
            Trusted Care. Better Every Day.
            <br />
            Bringing Long Term Illness People to Wellness.
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-[15px] leading-relaxed text-muted-foreground sm:text-base">
            Safe, Effective, Researched. Backed by nature. Trusted by professionals.
          </p>

          {/* Action bar — the reference's inline capture, wired to real destinations
              rather than a newsletter we have no backend for. */}
          <div className="mx-auto mt-9 flex w-full max-w-xl flex-col items-stretch gap-2 rounded-3xl border border-border bg-card p-2 shadow-[0_14px_40px_rgba(0,0,0,0.07)] sm:flex-row sm:items-center sm:justify-between sm:rounded-full sm:pl-7">
            <Link
              to="/products"
              className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-medium text-foreground transition-colors hover:text-[color:var(--botanical)] sm:px-0"
            >
              Explore Products <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={WA_ORDER}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[color:var(--botanical-deep)] px-7 py-3.5 text-sm font-semibold text-primary-foreground transition-transform duration-300 hover:-translate-y-0.5"
            >
              <MessageCircle className="h-4 w-4" />
              Order on WhatsApp
            </a>
          </div>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
            <Leaf className="h-4 w-4 text-[color:var(--botanical)]" />
            {HERO_BADGES.map((b, i) => (
              <div key={b.label} className="flex items-center gap-3">
                {i > 0 && <span className="h-3 w-px bg-border" />}
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  {b.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Product still-life, cut off by the section edge like the reference. */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, ease: EASE, delay: 0.15 }}
          className="relative mx-auto mt-12 flex h-[300px] max-w-3xl items-end justify-center px-6 sm:h-[420px]"
        >
          <img
            src={botanicals}
            alt=""
            aria-hidden="true"
            width={1200}
            height={1200}
            className="pointer-events-none absolute bottom-0 left-1/2 h-[70%] w-full max-w-2xl -translate-x-1/2 object-cover opacity-70"
            style={{
              maskImage: "radial-gradient(65% 70% at 50% 78%, black 0%, transparent 72%)",
              WebkitMaskImage: "radial-gradient(65% 70% at 50% 78%, black 0%, transparent 72%)",
            }}
          />
          <div className="pointer-events-none absolute bottom-10 h-24 w-[62%] rounded-[50%] bg-[color:var(--botanical)]/25 blur-3xl" />
          <img
            src={bottleBack}
            alt=""
            aria-hidden="true"
            width={912}
            height={1200}
            className="relative -mr-10 h-[62%] w-auto translate-y-2 opacity-90 drop-shadow-[0_22px_34px_rgba(0,0,0,0.22)] sm:-mr-14"
          />
          <img
            src={bottleFront}
            alt="Soliderma multi action wound healing spray bottle"
            width={912}
            height={1200}
            className="relative h-[88%] w-auto drop-shadow-[0_26px_44px_rgba(0,0,0,0.28)]"
          />
          <Sparkles className="absolute bottom-24 right-2 h-6 w-6 text-[color:var(--gold)] sm:right-8 sm:h-8 sm:w-8" />
        </motion.div>
      </section>

      {/* 02 TRUST & CERTIFICATIONS — same list as /certifications */}
      <div className="border-y border-border bg-[color:var(--surface)]">
        <div className="mx-auto grid max-w-6xl gap-6 px-6 py-12 sm:grid-cols-3">
          {CERTIFICATIONS.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.06}>
              <Link
                to="/certifications"
                className="flex h-full flex-col items-center gap-3 text-center transition-transform duration-300 hover:-translate-y-1"
              >
                <span className="relative inline-flex h-16 w-16 items-center justify-center rounded-full border border-[color:var(--gold)]/50 bg-[color:var(--ivory)]">
                  <span className="absolute inset-1 rounded-full border border-dashed border-[color:var(--botanical)]/30" />
                  <c.icon className="h-6 w-6 text-[color:var(--botanical)]" />
                </span>
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                  {c.title}
                </p>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>

      {/* 03 WORKS ON — conditions grid */}
      <Section>
        <Reveal>
          <SectionLabel index="01" label="Works On" />
          <h2 className="mt-6 max-w-2xl text-4xl text-foreground">
            Care that works where you need it most
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CONDITIONS.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.05}>
              <div className="flex h-full items-center gap-4 rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[color:var(--gold)]/60">
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[color:var(--botanical)]/10">
                  <c.icon className="h-5 w-5 text-[color:var(--botanical)]" />
                </span>
                <h3 className="text-base leading-tight text-foreground">{c.title}</h3>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.1}>
          <Link
            to="/wound-care"
            className="mt-10 inline-flex items-center gap-2 border-b border-[color:var(--burgundy)] pb-1 text-sm font-medium text-[color:var(--burgundy)]"
          >
            View All Conditions <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </Section>

      {/* 04 KEY BENEFITS */}
      <section className="relative isolate overflow-hidden bg-[color:var(--botanical-deep)] px-6 py-24 text-primary-foreground">
        <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-2">
          <Reveal>
            <img
              src={ingredientsMacro}
              alt="Turmeric root, aloe vera and dried cassia flowers"
              width={1200}
              height={900}
              loading="lazy"
              className="rounded-[2rem] object-cover"
            />
          </Reveal>
          <Reveal delay={0.1}>
            <div className="flex items-center gap-3">
              <span className="eyebrow text-[color:var(--gold)]">02</span>
              <span className="h-px w-8 bg-primary-foreground/30" />
              <span className="eyebrow text-primary-foreground/70">Key Benefits</span>
            </div>
            <h2 className="mt-6 text-4xl">Multi-action care for complete healing</h2>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-primary-foreground/75">
              Made with powerful herbs. Backed by modern science.
            </p>
            <ul className="mt-9 space-y-5">
              {BENEFITS.map((b, i) => {
                const Icon = BENEFIT_ICONS[i % BENEFIT_ICONS.length]!;
                return (
                  <li key={b.title} className="flex gap-4">
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[color:var(--gold)]/40 bg-[color:var(--gold)]/12">
                      <Icon className="h-4 w-4 text-[color:var(--gold)]" />
                    </span>
                    <div>
                      <h3 className="text-lg text-primary-foreground">{b.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-primary-foreground/70">
                        {b.body}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* 05 FEATURED PRODUCTS */}
      <section
        id="products"
        className="relative isolate overflow-hidden bg-[color:var(--surface)] px-6 py-24"
      >
        <Blob
          variant={1}
          className="-right-40 top-10 h-[420px] w-[420px] -z-10"
          color="var(--botanical)"
          opacity={0.12}
        />
        <div className="mx-auto max-w-6xl">
          <Reveal className="text-center">
            <SectionLabel index="03" label="Featured Products" />
            <h2 className="mt-6 text-4xl text-foreground">Find your care product</h2>
            <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
              Add to cart, share your details, and we deliver. More formulations are on the way.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURED.map((p, i) => {
              return (
                <Reveal key={p.slug} delay={i * 0.06}>
                  <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card">
                    <div className="relative isolate flex h-44 items-center justify-center overflow-hidden bg-[color:var(--ivory)]">
                      <Blob
                        variant={3}
                        className="-bottom-16 left-1/2 h-48 w-64 -translate-x-1/2 -z-10"
                        color="var(--botanical)"
                        opacity={p.available ? 0.16 : 0.07}
                      />
                      {p.image ? (
                        <img
                          src={p.image}
                          alt={`${p.name} ${p.subtitle}`}
                          loading="lazy"
                          className="h-40 w-auto drop-shadow-[0_14px_26px_rgba(0,0,0,0.16)]"
                        />
                      ) : (
                        <Leaf className="h-9 w-9 text-[color:var(--botanical)]/40" />
                      )}
                      {!p.available && (
                        <span className="absolute right-4 top-4 rounded-full bg-[color:var(--botanical-deep)]/85 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[color:var(--ivory)]">
                          Coming Soon
                        </span>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="text-xl text-foreground">{p.name}</h3>
                      <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-[color:var(--gold)]">
                        {p.available ? p.subtitle : "In development"}
                      </p>
                      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                        {p.blurb}
                      </p>
                      <div className="mt-5 border-t border-border pt-4">
                        <p className="font-display text-xl text-foreground">
                          {p.available ? priceLabel(p) : "Coming soon"}
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {p.variants.map((v) => v.size).join(" · ")}
                        </p>
                      </div>
                      <div className="mt-4">
                        <AddToCart product={p} compact />
                      </div>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {UPCOMING.map((p, i) => (
              <Reveal key={p.slug} delay={i * 0.06}>
                <article className="flex h-full flex-col items-start gap-4 rounded-2xl border border-dashed border-border p-7 sm:flex-row sm:items-center">
                  <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[color:var(--botanical)]/8">
                    <Sparkles className="h-5 w-5 text-[color:var(--botanical)]/60" />
                  </span>
                  <div className="flex-1">
                    <p className="eyebrow text-muted-foreground">Coming Soon</p>
                    <h3 className="mt-2 text-lg text-foreground">{p.name}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{p.blurb}</p>
                  </div>
                  <AddToCart product={p} compact />
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 06 WHY CHOOSE US */}
      <Section>
        <Reveal className="text-center">
          <SectionLabel index="04" label="Why Choose Us" />
          <h2 className="mt-6 text-4xl text-foreground">Why Thousands Trust Us</h2>
        </Reveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.06}>
              <div className="h-full rounded-2xl border border-border bg-card p-7 transition-transform duration-300 hover:-translate-y-1">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[color:var(--botanical)]/10">
                  <f.icon className="h-5 w-5 text-[color:var(--botanical)]" />
                </span>
                <h3 className="mt-5 text-xl text-foreground">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* 07 TESTIMONIALS */}
      <section
        id="testimonials"
        className="border-y border-border bg-[color:var(--surface)] px-6 py-24"
      >
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <SectionLabel index="05" label="Testimonials" />
            <h2 className="mt-6 text-4xl text-foreground">Real Stories. Real Results.</h2>
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={t.name} delay={i * 0.06}>
                <figure className="flex h-full flex-col rounded-2xl border border-border bg-card p-7">
                  <Quote className="h-7 w-7 text-[color:var(--botanical)]/25" />
                  <Stars rating={t.rating} className="mt-4" />
                  <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <figcaption className="mt-6 border-t border-border pt-4">
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

      {/* 08 ABOUT SNIPPET + METRICS */}
      <section className="relative isolate overflow-hidden bg-[color:var(--botanical-deep)] px-6 py-24 text-primary-foreground">
        <Blob
          variant={2}
          className="-left-40 -bottom-32 h-[480px] w-[560px] -z-10"
          color="var(--ivory)"
          opacity={0.07}
        />
        <div className="mx-auto max-w-5xl text-center">
          <Reveal>
            <span className="eyebrow text-[color:var(--gold)]">About</span>
            <h2 className="mt-5 text-4xl">About Vallalaar Remedies</h2>
            <p className="mx-auto mt-6 max-w-2xl text-[15px] leading-relaxed text-primary-foreground/75">
              {ABOUT_SNIPPET}
            </p>
            <Link
              to="/about"
              className="mt-8 inline-flex items-center gap-2 border-b border-[color:var(--gold)] pb-1 text-sm font-medium text-[color:var(--gold)]"
            >
              Read our story <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
        <div className="mx-auto mt-14 grid max-w-5xl divide-y divide-primary-foreground/15 border-y border-primary-foreground/15 sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x">
          {METRICS.map((m, i) => (
            <Reveal key={m.label} delay={i * 0.06}>
              <div className="px-4 py-7 text-center">
                <p className="font-display text-4xl text-[color:var(--gold)]">{m.value}</p>
                <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary-foreground/70">
                  {m.label}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 09 WELLNESS GUIDE */}
      <Section>
        <Reveal>
          <SectionLabel index="06" label="Wellness Guide" />
          <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
            <h2 className="text-4xl text-foreground">Learn. Care. Stay Healthy.</h2>
            <Link
              to="/wound-care"
              className="inline-flex items-center gap-2 text-sm font-medium text-[color:var(--burgundy)]"
            >
              All guides <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {GUIDES.map((g, i) => (
            <Reveal key={g.title} delay={i * 0.06}>
              <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card">
                <div className="h-44 overflow-hidden">
                  <img
                    src={g.image}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="eyebrow text-[color:var(--gold)]">{g.tag}</p>
                  <h3 className="mt-3 text-xl leading-tight text-foreground">{g.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {g.body}
                  </p>
                  <Link
                    to="/wound-care"
                    hash={g.slug}
                    className="mt-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--burgundy)]"
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

      {/* 10 FOR PROFESSIONALS */}
      <section className="border-y border-border bg-[color:var(--surface)] px-6 py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-2">
          <Reveal className="relative isolate">
            <div className="relative overflow-hidden rounded-[2rem]">
              <img
                src={forestHero}
                alt="Clinical partnership with Vallalaar Remedies"
                width={1200}
                height={900}
                loading="lazy"
                className="h-[340px] w-full object-cover sm:h-[420px]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--botanical-deep)]/90 to-[color:var(--botanical-deep)]/20" />
              <div className="absolute inset-x-0 bottom-0 p-8">
                <Stethoscope className="h-8 w-8 text-[color:var(--gold)]" />
                <p className="mt-4 font-display text-2xl text-[color:var(--ivory)]">
                  Clinics, hospitals &amp; pharmacies
                </p>
                <p className="mt-2 max-w-sm text-sm leading-relaxed text-[color:var(--ivory)]/75">
                  Supply, training and clinical support from one point of contact.
                </p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <SectionLabel index="07" label="For Professionals" />
            <h2 className="mt-6 text-4xl text-foreground">For Healthcare Professionals</h2>
            <ul className="mt-9 space-y-6">
              {HOME_PRO_POINTS.map((p) => (
                <li key={p.title} className="flex gap-4">
                  <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[color:var(--botanical)]/10">
                    <p.icon className="h-5 w-5 text-[color:var(--botanical)]" />
                  </span>
                  <div>
                    <h3 className="text-lg text-foreground">{p.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                to="/clinics"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-[color:var(--botanical-deep)]"
              >
                Partner With Us <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={WA_CLINIC}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-[color:var(--botanical)]/40 px-7 py-3.5 text-sm font-medium text-[color:var(--botanical)] transition-colors hover:border-[color:var(--botanical)]"
              >
                <MessageCircle className="h-4 w-4" />
                Bulk Enquiry
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 11 WHATSAPP CTA BANNER */}
      <section className="relative isolate overflow-hidden bg-[color:var(--burgundy)] px-6 py-24 text-center text-primary-foreground">
        <Blob
          variant={2}
          className="-bottom-40 left-1/2 h-[520px] w-[620px] -translate-x-1/2 -z-10"
          color="var(--ivory)"
          opacity={0.08}
        />
        <Reveal>
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-primary-foreground/25 bg-primary-foreground/10">
            <MessageCircle className="h-6 w-6" />
          </span>
          <h2 className="mx-auto mt-7 max-w-2xl text-4xl sm:text-[2.75rem]">
            Have questions or want to order? We&rsquo;re just a WhatsApp message away.
          </h2>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <a
              href={WA_ORDER}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-primary-foreground px-8 py-4 text-sm font-semibold text-[color:var(--burgundy)] transition-transform duration-300 hover:-translate-y-0.5"
            >
              <MessageCircle className="h-4 w-4" />
              Order on WhatsApp
            </a>
            <a
              href={`tel:${PHONE_TEL}`}
              className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/50 px-8 py-4 text-sm font-medium transition-colors hover:bg-primary-foreground/10"
            >
              <Phone className="h-4 w-4" />
              {PHONE_DISPLAY}
            </a>
          </div>
          <p className="mt-6 text-xs text-primary-foreground/65">
            Mon &ndash; Sat, 9 am to 7 pm IST
          </p>
        </Reveal>
      </section>
    </>
  );
}

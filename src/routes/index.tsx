import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  ArrowRight,
  ShieldCheck,
  Leaf,
  Sparkles,
  FileCheck2,
  Droplets,
  HeartPulse,
  Flame,
  BedDouble,
  Ambulance,
  BadgeCheck,
  Award,
  Scissors,
  Bug,
  Activity,
  Bandage,
} from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { Section, SectionLabel, Note } from "@/components/site/Section";
import { Blob } from "@/components/site/Blob";
import { AddToCart } from "@/components/site/AddToCart";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PRODUCTS } from "@/lib/products";
import { BENEFITS, CASES, INGREDIENTS, STEPS, TRUST_BADGES } from "@/lib/site";
import careRoutine from "@/assets/care-routine.jpg";
import ingredientsMacro from "@/assets/ingredients-macro.jpg";
import forestHero from "@/assets/forest-hero.jpg";

const WOUND_TILES = [
  { icon: Droplets, title: "Diabetic Wounds", body: "Supportive care for diabetic-related wounds." },
  { icon: BedDouble, title: "Bed Sores", body: "For pressure-related sore care routines." },
  { icon: Ambulance, title: "Accident Injuries", body: "Wound-care support after accidental injury." },
  { icon: Flame, title: "Fire Injuries", body: "For care situations involving burn injuries." },
  { icon: Scissors, title: "Post-Surgical Wounds", body: "Supportive routine care after surgical procedures." },
  { icon: Activity, title: "Non-Healing Ulcers", body: "For slow-healing chronic ulcer care routines." },
  { icon: Bandage, title: "Cuts & Abrasions", body: "Everyday cuts, scrapes and minor open wounds." },
  { icon: Bug, title: "Skin Infections", body: "Supportive care for irritated, infection-prone skin." },
];


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Vallalaar Remedies | Soliderma Ayurvedic Wound Healing Spray" },
      {
        name: "description",
        content:
          "Soliderma multi action wound healing spray by Vallalaar Remedies — a herbal Ayurvedic wound-care formulation in a convenient modern spray format.",
      },
      { property: "og:title", content: "Healing, Rooted in Ayurveda | Vallalaar Remedies" },
      {
        property: "og:description",
        content:
          "Soliderma is an Ayurvedic proprietary medicine presented as a multi action wound healing spray.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <>
      {/* 01 HERO — bento grid over forest */}
      <section className="relative isolate overflow-hidden">
        {/* cinematic forest plate */}
        <div className="relative h-[62vh] min-h-[420px] w-full lg:h-[74vh]">
          <motion.img
            src={forestHero}
            alt="Aerial drone view of the Amazon rainforest canopy at sunrise"
            width={1920}
            height={1080}
            initial={{ scale: 1.12 }}
            animate={{ scale: 1 }}
            transition={{ duration: 2.4, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 h-full w-full object-cover"
          />
          {/* cinematic grade: vignette + top/bottom falloff */}
          <div className="absolute inset-0 bg-gradient-to-b from-[color:var(--botanical-deep)]/70 via-[color:var(--botanical-deep)]/25 to-[color:var(--botanical-deep)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,color-mix(in_oklab,var(--botanical-deep)_75%,transparent)_100%)]" />

          <div className="absolute inset-0 flex items-center justify-center px-6">
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
              className="mx-auto max-w-3xl text-center"
            >
              <div className="flex items-center justify-center gap-3">
                <span className="h-px w-8 bg-[color:var(--gold)]" />
                <p className="eyebrow text-[color:var(--gold)]">Ayurvedic Wound Care</p>
                <span className="h-px w-8 bg-[color:var(--gold)]" />
              </div>
              <h1 className="mt-6 text-[2.7rem] leading-[1.03] text-[color:var(--ivory)] sm:text-[4rem]">
                Healing, rooted in{" "}
                <span className="text-[color:var(--gold)]">Ayurveda.</span>
              </h1>
              <p className="mx-auto mt-6 max-w-xl text-[15px] leading-relaxed text-[color:var(--ivory)]/80">
                Soliderma&trade; — a multi action herbal wound healing spray, made for modern care
                routines.
              </p>
              <div className="mt-9 flex flex-wrap justify-center gap-3">
                <Link
                  to="/soliderma"
                  className="inline-flex items-center gap-2 rounded-full bg-[color:var(--ivory)] px-7 py-3 text-sm font-medium text-[color:var(--botanical-deep)] transition-colors hover:bg-[color:var(--gold)]"
                >
                  Shop Soliderma <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/cart"
                  className="inline-flex items-center rounded-full border border-[color:var(--ivory)]/35 px-7 py-3 text-sm font-medium text-[color:var(--ivory)] transition-colors hover:bg-[color:var(--ivory)]/10"
                >
                  View Cart
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* credentials band under the forest */}
        <div className="relative bg-[color:var(--botanical-deep)] px-6 pb-20 pt-10">
          <div className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { k: "Herbal", v: "Formulation", icon: Leaf },
              { k: "Doctor", v: "Trusted", icon: HeartPulse },
              { k: "AYUSH", v: "Compliant", icon: ShieldCheck },
              { k: "Multi", v: "Action", icon: Sparkles },
            ].map((t, i) => (
              <motion.div
                key={t.k}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm transition-transform duration-300 hover:-translate-y-1"
              >
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[color:var(--gold)]/40 bg-[color:var(--gold)]/12">
                  <t.icon className="h-5 w-5 text-[color:var(--gold)]" />
                </span>
                <div>
                  <p className="font-display text-base font-semibold text-[color:var(--ivory)]">
                    {t.k}
                  </p>
                  <p className="mt-0.5 text-[10px] uppercase tracking-[0.18em] text-[color:var(--ivory)]/65">
                    {t.v}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </section>

      {/* CERTIFICATION SEALS — symbol medallions */}
      <div className="border-y border-border bg-[color:var(--surface)]">
        <div className="mx-auto grid max-w-6xl gap-6 px-6 py-12 sm:grid-cols-2 lg:grid-cols-4">
          {TRUST_BADGES.map((b, i) => {
            const Icon = [Leaf, FileCheck2, BadgeCheck, Award][i % 4]!;
            return (
              <Reveal key={b} delay={i * 0.06}>
                <div className="flex h-full flex-col items-center gap-3 text-center">
                  <span className="relative inline-flex h-16 w-16 items-center justify-center rounded-full border border-[color:var(--gold)]/50 bg-[color:var(--ivory)]">
                    <span className="absolute inset-1 rounded-full border border-dashed border-[color:var(--botanical)]/30" />
                    <Icon className="h-6 w-6 text-[color:var(--botanical)]" />
                  </span>
                  <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                    {b}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>

      {/* 02 WHAT IS SOLIDERMA — side image + accordion */}
      <section className="relative isolate overflow-hidden bg-[color:var(--surface)] px-6 py-24">
        <Blob
          variant={3}
          className="-left-40 -top-24 h-[420px] w-[420px] -z-10"
          color="var(--botanical)"
          opacity={0.14}
        />
        <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-2">
          <Reveal className="relative isolate">
            <Blob
              variant={2}
              className="-left-10 -top-8 h-[112%] w-[112%] -z-10"
              color="var(--botanical)"
              opacity={0.18}
            />
            <img
              src={careRoutine}
              alt="Wound-care dressing supplies with a herbal spray bottle on ivory linen"
              width={1200}
              height={1200}
              loading="lazy"
              className="relative aspect-square w-full rounded-[2rem] object-cover"
            />
          </Reveal>
          <Reveal delay={0.1}>
            <SectionLabel index="01" label="Multi Action" />
            <h2 className="mt-6 text-4xl text-foreground">What is Soliderma?</h2>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted-foreground">
              One herbal formulation, several supportive actions. Tap to explore each.
            </p>
            <Accordion type="single" collapsible defaultValue="b-0" className="mt-8">
              {BENEFITS.map((b, i) => (
                <AccordionItem key={b.title} value={`b-${i}`}>
                  <AccordionTrigger className="text-left font-display text-lg">
                    {b.title}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                    {b.body}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </section>

      {/* 03 WOUND TILES — icon visuals */}
      <Section>
        <Reveal>
          <SectionLabel index="02" label="Where Soliderma is Used" />
          <h2 className="mt-6 max-w-2xl text-4xl text-foreground">
            Designed for different wound-care needs
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {WOUND_TILES.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.06}>
              <div className="group h-full rounded-2xl border border-border bg-card p-7 transition-transform duration-300 hover:-translate-y-1">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[color:var(--botanical)]/10">
                  <c.icon className="h-5 w-5 text-[color:var(--botanical)]" />
                </span>
                <h3 className="mt-5 text-xl text-foreground">{c.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.1}>
          <Link
            to="/wound-care"
            className="mt-10 inline-flex items-center gap-2 border-b border-[color:var(--burgundy)] pb-1 text-sm font-medium text-[color:var(--burgundy)]"
          >
            Learn more about wound care <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </Section>

      {/* 04 CATALOGUE */}
      <section className="relative isolate overflow-hidden bg-[color:var(--surface)] px-6 py-24">
        <Blob
          variant={1}
          className="-right-40 top-10 h-[420px] w-[420px] -z-10"
          color="var(--botanical)"
          opacity={0.12}
        />
        <div className="mx-auto max-w-6xl">
          <Reveal className="text-center">
            <h2 className="text-4xl text-foreground">Find your care product</h2>
            <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
              Add to cart, share your details, and we deliver. More products are on the way.
            </p>
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PRODUCTS.map((p, i) => (
              <Reveal key={p.slug} delay={i * 0.06}>
                <article
                  className={`flex h-full flex-col overflow-hidden rounded-2xl border ${
                    p.available ? "border-border bg-card" : "border-dashed border-border"
                  }`}
                >
                  <div className="relative isolate flex h-40 items-center justify-center overflow-hidden bg-[color:var(--ivory)]">
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
                        className="h-36 w-auto drop-shadow-[0_14px_26px_rgba(0,0,0,0.16)]"
                      />
                    ) : (
                      <Leaf className="h-9 w-9 text-[color:var(--botanical)]/40" />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="text-xl text-foreground">{p.name}</h3>
                    <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-[color:var(--gold)]">
                      {p.subtitle}
                    </p>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {p.blurb}
                    </p>
                    <div className="mt-5">
                      <AddToCart product={p} compact />
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 05 FORMULATION — dark band, side macro image */}
      <section className="relative isolate overflow-hidden bg-[color:var(--botanical-deep)] px-6 py-24 text-primary-foreground">
        <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-2 lg:items-center">
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
              <span className="eyebrow text-[color:var(--gold)]">03</span>
              <span className="h-px w-8 bg-primary-foreground/30" />
              <span className="eyebrow text-primary-foreground/70">The Formulation</span>
            </div>
            <h2 className="mt-6 text-4xl">Inspired by Ayurveda. Prepared with purpose.</h2>
            <ul className="mt-8 divide-y divide-primary-foreground/15 border-t border-primary-foreground/15">
              {INGREDIENTS.map((i) => (
                <li key={i.name} className="grid grid-cols-[1fr_1.2fr_auto] gap-3 py-3 text-sm">
                  <span className="font-medium">{i.name}</span>
                  <span className="italic text-primary-foreground/65">{i.latin}</span>
                  <span className="text-primary-foreground/65">{i.part}</span>
                </li>
              ))}
            </ul>
            <Link
              to="/soliderma"
              className="mt-8 inline-flex items-center gap-2 border-b border-[color:var(--gold)] pb-1 text-sm font-medium text-[color:var(--gold)]"
            >
              View formulation details <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* 06 HOW TO USE — visual numbered steps */}
      <Section>
        <Reveal className="text-center">
          <SectionLabel index="04" label="How to Use" />
        </Reveal>
        <Reveal className="mt-6 text-center">
          <h2 className="text-4xl text-foreground">Simple application. Consistent care.</h2>
        </Reveal>
        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <Reveal key={s.step} delay={i * 0.06}>
              <div className="relative h-full pl-4">
                <span className="font-display text-6xl text-[color:var(--botanical)]/15">
                  {s.step}
                </span>
                <h3 className="mt-2 text-lg text-foreground">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* 07 WHY — compact icon row */}
      <section className="border-y border-border bg-[color:var(--surface)] px-6 py-20">
        <div className="mx-auto grid max-w-6xl gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Leaf, title: "Herbal Formulation" },
            { icon: Sparkles, title: "Multi-Action Approach" },
            { icon: HeartPulse, title: "Convenient Application" },
            { icon: FileCheck2, title: "Quality & Compliance" },
          ].map((f, i) => (
            <Reveal key={f.title} delay={i * 0.05}>
              <div className="flex items-center gap-4">
                <f.icon className="h-6 w-6 shrink-0 text-[color:var(--botanical)]" />
                <h3 className="text-lg text-foreground">{f.title}</h3>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 08 STORIES */}
      <Section>
        <Reveal>
          <SectionLabel index="05" label="Real Stories" />
          <h2 className="mt-6 text-4xl text-foreground">Real cases. Real progress.</h2>
        </Reveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CASES.map((c, i) => (
            <Reveal key={c.id} delay={i * 0.05}>
              <article className="h-full rounded-2xl border border-border bg-card p-7">
                <span className="eyebrow text-[color:var(--gold)]">Case {c.id}</span>
                <h3 className="mt-3 text-2xl text-foreground">{c.name}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{c.line}</p>
              </article>
            </Reveal>
          ))}
        </div>
        <Note>
          Patient photographs and testimonials are published only with appropriate consent and with
          medically accurate case descriptions.
        </Note>
      </Section>

      {/* 09 FINAL CTA */}
      <section className="relative isolate overflow-hidden bg-[color:var(--burgundy)] px-6 py-24 text-center text-primary-foreground">
        <Blob
          variant={2}
          className="-bottom-40 left-1/2 h-[520px] w-[620px] -translate-x-1/2 -z-10"
          color="var(--ivory)"
          opacity={0.08}
        />
        <Reveal>
          <h2 className="mx-auto max-w-2xl text-4xl sm:text-5xl">
            Rooted in Ayurveda. Made for today.
          </h2>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link
              to="/soliderma"
              className="rounded-full bg-primary-foreground px-7 py-3 text-sm font-medium text-[color:var(--burgundy)]"
            >
              Explore Soliderma
            </Link>
            <Link
              to="/cart"
              className="rounded-full border border-primary-foreground/60 px-7 py-3 text-sm font-medium"
            >
              Go to Cart
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { useRef } from "react";
import { ChevronDown } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { Section, SectionLabel, Note } from "@/components/site/Section";
import { AddToCart } from "@/components/site/AddToCart";
import { NotifyMe } from "@/components/site/NotifyMe";
import { Button } from "@/components/ui/button";
import { PRODUCTS, getProduct, variantPriceLabel } from "@/lib/products";
import { BENEFITS, CONDITIONS, INGREDIENTS, STEPS } from "@/lib/site";
import bottle from "@/assets/soliderma-bottle.png";
import bottleBack from "@/assets/soliderma-bottle-back.png";
import botanicals from "@/assets/botanicals.jpg";

export const Route = createFileRoute("/soliderma")({
  head: () => ({
    meta: [
      { title: "Soliderma™ Multi Action Wound Healing Spray | Vallalaar Remedies" },
      {
        name: "description",
        content:
          "Soliderma is an Ayurvedic proprietary medicine in spray format. Explore its formulation, wound categories, sizes and application steps.",
      },
      { property: "og:title", content: "Soliderma™ Wound Healing Spray" },
      {
        property: "og:description",
        content:
          "Herbal wound-care spray with an Ayurvedic proprietary formulation. 50 ml and 100 ml.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Soliderma,
});

const SOLIDERMA_PRODUCT = getProduct("soliderma");
const OTHER_PRODUCTS = PRODUCTS.filter((p) => p.slug !== "soliderma");

function Soliderma() {
  const stageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ["start start", "end end"],
  });
  const p = useSpring(scrollYProgress, { stiffness: 80, damping: 24, mass: 0.7 });

  // Two panels only: panel 1 = front pose, panel 2 = back pose.
  const frontOpacity = useTransform(p, [0.18, 0.45], [1, 0]);
  const frontRotate = useTransform(p, [0.18, 0.45], [0, -90]);
  const backOpacity = useTransform(p, [0.4, 0.62], [0, 1]);
  const backRotate = useTransform(p, [0.4, 0.62], [90, 0]);
  const stageScale = useTransform(p, [0, 0.5, 1], [1, 0.94, 1]);
  const cueOpacity = useTransform(p, [0, 0.18], [1, 0]);

  const scrollToDetails = () => {
    document.getElementById("details")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (!SOLIDERMA_PRODUCT) return null;

  const soliderma = SOLIDERMA_PRODUCT;

  return (
    <>
      <section className="bg-[color:var(--surface)] px-6">
        <div ref={stageRef} className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          {/* Sticky product stage */}
          <div className="pointer-events-none top-0 mx-auto flex h-[46vh] w-full items-center justify-center lg:sticky lg:h-screen">
            <motion.div
              style={{ scale: stageScale }}
              className="relative h-full w-full max-w-md [perspective:1200px]"
            >
              <div className="absolute inset-x-10 bottom-[16%] h-10 rounded-full bg-[color:var(--botanical)]/20 blur-2xl" />
              <motion.img
                src={bottle}
                alt="Soliderma multi action wound healing spray bottle, front view"
                width={912}
                height={1200}
                style={{ opacity: frontOpacity, rotateY: frontRotate }}
                className="absolute inset-0 m-auto h-[38vh] w-auto drop-shadow-xl will-change-transform [backface-visibility:hidden] lg:h-[62vh] lg:max-h-[560px]"
              />
              <motion.img
                src={bottleBack}
                alt="Soliderma spray bottle, back label with directions and ingredients"
                width={912}
                height={1200}
                loading="lazy"
                style={{ opacity: backOpacity, rotateY: backRotate }}
                className="absolute inset-0 m-auto h-[38vh] w-auto drop-shadow-xl will-change-transform [backface-visibility:hidden] lg:h-[62vh] lg:max-h-[560px]"
              />
            </motion.div>
          </div>

          {/* Two content panels */}
          <div className="relative z-10">
            <div className="flex min-h-[60vh] flex-col justify-center py-10 lg:min-h-screen lg:py-0">
              <p className="eyebrow text-[color:var(--gold)]">Product</p>
              <h1 className="mt-4 text-5xl text-foreground">Soliderma&trade;</h1>
              <p className="mt-3 font-display text-xl text-[color:var(--burgundy)]">
                Multi Action Wound Healing Spray
              </p>
              <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-muted-foreground">
                A herbal wound-care spray developed around an Ayurvedic proprietary formulation.
              </p>
              <dl className="mt-8 grid max-w-md grid-cols-2 gap-6 text-sm">
                <div>
                  <dt className="eyebrow text-muted-foreground">Form</dt>
                  <dd className="mt-1 text-foreground">Spray</dd>
                </div>
                <div>
                  <dt className="eyebrow text-muted-foreground">Category</dt>
                  <dd className="mt-1 text-foreground">Ayurvedic Proprietary Medicine</dd>
                </div>
              </dl>
              <div className="mt-9 space-y-4">
                <AddToCart product={soliderma} />
                <Link
                  to="/contact"
                  className="inline-flex rounded-full border border-[color:var(--burgundy)] px-7 py-3 text-sm font-medium text-[color:var(--burgundy)]"
                >
                  Send an Enquiry
                </Link>
              </div>
              <motion.div style={{ opacity: cueOpacity }} className="mt-12">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={scrollToDetails}
                  aria-label="Scroll for more product details"
                  className="group h-auto flex-col items-start gap-3 rounded-full px-0 py-2 text-muted-foreground hover:text-[color:var(--botanical)]"
                >
                  <span className="eyebrow">More Product Details</span>
                  <motion.span
                    animate={{ y: [0, 9, 0] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--gold)]/50 bg-[color:var(--ivory)] group-hover:border-[color:var(--botanical)]"
                  >
                    <ChevronDown className="h-5 w-5" />
                  </motion.span>
                </Button>
              </motion.div>
            </div>

            <div
              id="details"
              className="flex min-h-[60vh] scroll-mt-0 flex-col justify-center border-t border-border py-14 lg:min-h-screen"
            >
              <Reveal>
                <SectionLabel index="02" label="Products" />
                <h2 className="mt-6 text-4xl text-foreground">Available Product Sizes</h2>
              </Reveal>
              <div className="mt-10 grid gap-6">
                {soliderma.variants.map((v, i) => (
                  <Reveal key={v.size} delay={i * 0.06}>
                    <div className="flex h-full flex-wrap items-center justify-between gap-6 rounded-lg border border-border bg-card p-7">
                      <div>
                        <h3 className="text-2xl text-foreground">{v.size}</h3>
                        <p className="mt-2 text-sm text-muted-foreground">{v.note}</p>
                        <p className="mt-3 font-display text-lg text-foreground">
                          {variantPriceLabel(v)}
                        </p>
                      </div>
                      <AddToCart product={{ ...soliderma, variants: [v] }} compact />
                    </div>
                  </Reveal>
                ))}
              </div>
              <div className="mt-10 grid gap-5 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                {OTHER_PRODUCTS.map((prod, i) => (
                  <Reveal key={prod.slug} delay={i * 0.06}>
                    <div className="h-full rounded-lg border border-dashed border-border p-6">
                      <h3 className="text-lg text-foreground">{prod.name}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {prod.blurb}
                      </p>
                      <p className="mt-4 text-xs uppercase tracking-[0.16em] text-[color:var(--gold)]">
                        Coming soon
                      </p>
                      <div className="mt-4">
                        <NotifyMe productName={prod.name} />
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Section className="bg-[color:var(--surface)]">
        <div className="grid gap-14 lg:grid-cols-2">
          <Reveal>
            <h2 className="text-3xl text-foreground">Key Benefits</h2>
            <ul className="mt-6 divide-y divide-border border-t border-border">
              {BENEFITS.map((b) => (
                <li key={b.title} className="py-4">
                  <p className="text-lg text-foreground">{b.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{b.body}</p>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="text-3xl text-foreground">Suitable Wound Categories</h2>
            <ul className="mt-6 divide-y divide-border border-t border-border">
              {CONDITIONS.map((c) => (
                <li key={c.title} className="flex gap-4 py-4">
                  <span className="mt-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[color:var(--botanical)]/10">
                    <c.icon className="h-4 w-4 text-[color:var(--botanical)]" />
                  </span>
                  <div>
                    <p className="text-lg text-foreground">{c.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{c.body}</p>
                  </div>
                </li>
              ))}
            </ul>
            <Link
              to="/wound-care"
              className="mt-8 inline-flex items-center gap-2 border-b border-[color:var(--burgundy)] pb-1 text-sm font-medium text-[color:var(--burgundy)]"
            >
              Read the wellness guide
            </Link>
          </Reveal>
        </div>
      </Section>

      <section className="bg-[color:var(--botanical-deep)] px-6 py-24 text-primary-foreground">
        <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="eyebrow text-[color:var(--gold)]">04</span>
              <span className="h-px w-8 bg-primary-foreground/30" />
              <span className="eyebrow text-primary-foreground/70">Formulation Details</span>
            </div>
            <h2 className="mt-6 text-4xl">Selected Formulation Ingredients</h2>
            <ul className="mt-8 divide-y divide-primary-foreground/15 border-t border-primary-foreground/15">
              {INGREDIENTS.map((i) => (
                <li key={i.name} className="grid grid-cols-[1fr_1.2fr_auto] gap-3 py-3 text-sm">
                  <span className="font-medium">{i.name}</span>
                  <span className="italic text-primary-foreground/65">{i.latin}</span>
                  <span className="text-primary-foreground/65">{i.part}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-xs leading-relaxed text-primary-foreground/60">
              The supplied formulation document also describes a preparation process involving
              washing, boiling, filtration, extraction, dissolution and final volume adjustment.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <img
              src={botanicals}
              alt="Ayurvedic ingredients including turmeric, aloe vera and triphala"
              width={1408}
              height={1008}
              loading="lazy"
              className="rounded-lg object-cover"
            />
          </Reveal>
        </div>
      </section>

      <Section>
        <Reveal>
          <SectionLabel index="07" label="How to Use" />
          <h2 className="mt-6 text-4xl text-foreground">Simple Application. Consistent Care.</h2>
        </Reveal>
        <div className="mt-12 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <Reveal key={s.step} delay={i * 0.06} className="bg-card">
              <div className="h-full p-7">
                <span className="font-display text-3xl text-[color:var(--gold)]">{s.step}</span>
                <h3 className="mt-4 text-lg text-foreground">{s.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Note>
          For significant, infected, deep, diabetic or otherwise serious wounds, please seek
          appropriate professional medical care. Product use should follow the approved
          instructions.
        </Note>
      </Section>
    </>
  );
}

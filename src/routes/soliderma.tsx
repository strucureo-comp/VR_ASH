import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  ShieldCheck,
  Sparkles,
  Flame,
  Scissors,
  Droplet,
  HeartPulse,
  Leaf,
  CheckCircle2,
  Shield,
} from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { SectionLabel } from "@/components/site/Section";
import { AddToCart } from "@/components/site/AddToCart";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  formatMoney,
  imageAlt,
  isSolidermaHandle,
  sizedImage,
  variantLabel,
} from "@/lib/shopify/format";
import { productQuery, productsQuery } from "@/lib/shopify/queryOptions";
import { contentId } from "@/lib/content/paths";
import { productContentQuery } from "@/lib/content/queryOptions";
import { paragraphs, preferSaved } from "@/lib/content/render";
import { INGREDIENTS } from "@/lib/site";
import bottle from "@/assets/soliderma-bottle.png";
import botanicals from "@/assets/botanicals.jpg";

export const Route = createFileRoute("/soliderma")({
  loader: async ({ context }) => {
    const [exact, all] = await Promise.all([
      context.queryClient.ensureQueryData(productQuery("soliderma")),
      context.queryClient.ensureQueryData(productsQuery(24)),
    ]);
    const product = exact ?? all.find((p) => isSolidermaHandle(p.handle)) ?? null;
    const content = product
      ? await context.queryClient.ensureQueryData(productContentQuery(contentId(product.id)))
      : null;
    return {
      product,
      content,
      others: all.filter((p) => !isSolidermaHandle(p.handle)).slice(0, 3),
    };
  },
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

interface DesktopScrollytellingProps {
  bottleSrc: string;
  bottleAlt: string;
  scrollToSection: (id: string) => void;
}

function DesktopScrollytelling({
  bottleSrc,
  bottleAlt,
  scrollToSection,
}: DesktopScrollytellingProps) {
  const runwayRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: runwayRef,
    offset: ["start start", "end end"],
  });

  const bottleXDesktop = useTransform(
    scrollYProgress,
    [0, 0.16, 0.28, 0.44, 0.56, 0.72, 0.84, 1],
    ["0px", "0px", "-200px", "-200px", "200px", "200px", "0px", "0px"]
  );

  const bottleRotate = useTransform(
    scrollYProgress,
    [0, 0.16, 0.28, 0.44, 0.56, 0.72, 0.84, 1],
    [0, 0, -6, -6, 6, 6, 0, 0]
  );

  const shadowSkew = useTransform(
    scrollYProgress,
    [0, 0.16, 0.28, 0.44, 0.56, 0.72, 0.84, 1],
    [0, 0, 4, 4, -4, -4, 0, 0]
  );

  const heroOpacity = useTransform(scrollYProgress, [0, 0.13, 0.19, 1], [1, 1, 0, 0], {
    clamp: true,
  });
  const heroY = useTransform(scrollYProgress, [0, 0.19, 1], [0, -25, -25], { clamp: true });

  const stage1Opacity = useTransform(
    scrollYProgress,
    [0, 0.21, 0.28, 0.44, 0.50, 1],
    [0, 0, 1, 1, 0, 0],
    { clamp: true }
  );
  const stage1Y = useTransform(
    scrollYProgress,
    [0, 0.21, 0.28, 0.44, 0.50, 1],
    [25, 25, 0, 0, -25, -25],
    { clamp: true }
  );

  const stage2Opacity = useTransform(
    scrollYProgress,
    [0, 0.52, 0.59, 0.72, 0.78, 1],
    [0, 0, 1, 1, 0, 0],
    { clamp: true }
  );
  const stage2Y = useTransform(
    scrollYProgress,
    [0, 0.52, 0.59, 0.72, 0.78, 1],
    [25, 25, 0, 0, -25, -25],
    { clamp: true }
  );

  const stage3Opacity = useTransform(scrollYProgress, [0, 0.78, 0.85, 1], [0, 0, 1, 1], {
    clamp: true,
  });
  const stage3Y = useTransform(scrollYProgress, [0, 0.78, 0.85, 1], [20, 20, 0, 0], {
    clamp: true,
  });

  return (
    <div ref={runwayRef} className="relative h-[280vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        {/* Ambient Radial Glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-25"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(38,80,56,0.10) 0%, rgba(201,168,76,0.05) 50%, transparent 80%)",
          }}
        />

        <div className="relative mx-auto flex h-full w-full max-w-6xl items-center justify-center px-4 sm:px-6">
          {/* PHASE 0: HERO STATE */}
          <motion.div
            style={{
              opacity: heroOpacity,
              y: heroY,
            }}
            className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-between pb-8 pt-16 sm:pt-20 text-center"
          >
            <div>
              <p className="eyebrow tracking-[0.25em] text-[color:var(--gold)]">
                ANTISEPTIC FIRST AID SKIN SPRAY
              </p>
              <h1 className="mt-1 font-serif text-4xl sm:text-6xl lg:text-7xl font-normal tracking-tight text-foreground">
                SOLIDERMA<span className="text-xl align-top text-[color:var(--gold)]">™</span>
              </h1>
              <p className="mt-1 font-serif text-base sm:text-xl text-[color:var(--burgundy)]">
                Multi Action Wound Healing Spray
              </p>
            </div>

            <div className="pointer-events-auto flex flex-col items-center gap-3 pb-2 sm:pb-6">
              <p className="max-w-md px-4 text-xs sm:text-sm text-muted-foreground">
                Quick action antiseptic first aid spray for wounds, cuts and burns.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Button
                  onClick={() => scrollToSection("sizes")}
                  className="h-10 sm:h-11 rounded-full bg-[color:var(--botanical-deep)] px-6 sm:px-7 text-xs sm:text-sm font-medium text-primary-foreground shadow-sm hover:bg-[color:var(--botanical)]"
                >
                  Get Soliderma
                </Button>
                <Button
                  variant="outline"
                  onClick={() => scrollToSection("actions")}
                  className="h-10 sm:h-11 rounded-full border-border bg-card px-5 sm:px-6 text-xs sm:text-sm font-medium hover:bg-card"
                >
                  View Details
                </Button>
              </div>

              <div className="mt-1 flex items-center gap-1.5 text-[11px] text-muted-foreground/80">
                <span>Scroll to explore</span>
                <motion.div
                  animate={{ y: [0, 3, 0] }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <ChevronDown className="h-3.5 w-3.5" />
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* PHASE 1: GENTLE SHIFT LEFT & SUBTLE TILT (-6°) -> RIGHT SIDE BENEFITS */}
          <motion.div
            id="actions"
            style={{
              opacity: stage1Opacity,
              y: stage1Y,
            }}
            className="pointer-events-none absolute z-20 w-full max-w-sm md:max-w-md lg:max-w-lg
                       top-1/2 -translate-y-1/2 left-[calc(50%+48px)] right-auto"
          >
            <div className="border-0 bg-transparent p-0 shadow-none">
              <p className="eyebrow tracking-[0.2em] text-[color:var(--gold)]">HOW IT HELPS</p>
              <h2 className="mt-1 font-serif text-2xl sm:text-4xl lg:text-5xl font-normal leading-tight text-foreground">
                Four actions,
                <br className="hidden sm:inline" /> one spray.
              </h2>
              <ul className="mt-4 sm:mt-6 space-y-3 sm:space-y-4">
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 sm:h-6 sm:w-6 shrink-0 items-center justify-center rounded-full bg-[color:var(--botanical)]/15 text-[color:var(--botanical)]">
                    <HeartPulse className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  </span>
                  <div>
                    <h3 className="font-semibold text-foreground text-xs sm:text-sm">Rapid wound healing</h3>
                    <p className="mt-0.5 text-[11px] sm:text-xs text-muted-foreground leading-relaxed">
                      Accelerates skin tissue regeneration with active Ayurvedic extracts.
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 sm:h-6 sm:w-6 shrink-0 items-center justify-center rounded-full bg-[color:var(--botanical)]/15 text-[color:var(--botanical)]">
                    <ShieldCheck className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  </span>
                  <div>
                    <h3 className="font-semibold text-foreground text-xs sm:text-sm">Antimicrobial cover</h3>
                    <p className="mt-0.5 text-[11px] sm:text-xs text-muted-foreground leading-relaxed">
                      Prevents bacterial colonization and forms an active protective barrier.
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 sm:h-6 sm:w-6 shrink-0 items-center justify-center rounded-full bg-[color:var(--botanical)]/15 text-[color:var(--botanical)]">
                    <Droplet className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  </span>
                  <div>
                    <h3 className="font-semibold text-foreground text-xs sm:text-sm">Pain relief & soothing</h3>
                    <p className="mt-0.5 text-[11px] sm:text-xs text-muted-foreground leading-relaxed">
                      Cools irritation immediately upon application with zero sting or burning.
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 sm:h-6 sm:w-6 shrink-0 items-center justify-center rounded-full bg-[color:var(--botanical)]/15 text-[color:var(--botanical)]">
                    <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  </span>
                  <div>
                    <h3 className="font-semibold text-foreground text-xs sm:text-sm">Scar prevention</h3>
                    <p className="mt-0.5 text-[11px] sm:text-xs text-muted-foreground leading-relaxed">
                      Minimizes tissue marks and promotes clean, healthy skin texture recovery.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* PHASE 2: GENTLE SHIFT RIGHT & SUBTLE TILT (+6°) -> LEFT SIDE WOUND CARDS */}
          <motion.div
            style={{
              opacity: stage2Opacity,
              y: stage2Y,
            }}
            className="pointer-events-none absolute z-20 w-full max-w-sm md:max-w-md lg:max-w-lg
                       top-1/2 -translate-y-1/2 right-[calc(50%+48px)] left-auto"
          >
            <div className="border-0 bg-transparent p-0 shadow-none">
              <p className="eyebrow tracking-[0.2em] text-[color:var(--gold)]">WHERE TO APPLY</p>
              <h2 className="mt-1 font-serif text-2xl sm:text-4xl lg:text-5xl font-normal leading-tight text-foreground">
                Made for everyday
                <br className="hidden sm:inline" /> wounds
              </h2>

              <div className="mt-4 sm:mt-6 space-y-2.5 sm:space-y-3">
                <div className="rounded-xl border border-border/80 bg-card/90 p-3 sm:p-4 shadow-sm">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[color:var(--botanical)]/10 text-[color:var(--botanical)]">
                      <Scissors className="h-3.5 w-3.5" />
                    </span>
                    <h3 className="font-semibold text-foreground text-xs sm:text-sm">
                      Common Cuts & Scrapes
                    </h3>
                  </div>
                  <p className="mt-1 text-[11px] sm:text-xs text-muted-foreground leading-relaxed">
                    Household grazes, paper cuts, kitchen accidents, and surface abrasions.
                  </p>
                </div>

                <div className="rounded-xl border border-border/80 bg-card/90 p-3 sm:p-4 shadow-sm">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[color:var(--botanical)]/10 text-[color:var(--botanical)]">
                      <Flame className="h-3.5 w-3.5" />
                    </span>
                    <h3 className="font-semibold text-foreground text-xs sm:text-sm">
                      Minor Burns & Scalds
                    </h3>
                  </div>
                  <p className="mt-1 text-[11px] sm:text-xs text-muted-foreground leading-relaxed">
                    Instant cooling relief for accidental kitchen burns, steam, and surface scalds.
                  </p>
                </div>

                <div className="rounded-xl border border-border/80 bg-card/90 p-3 sm:p-4 shadow-sm">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[color:var(--botanical)]/10 text-[color:var(--botanical)]">
                      <Shield className="h-3.5 w-3.5" />
                    </span>
                    <h3 className="font-semibold text-foreground text-xs sm:text-sm">
                      Post-Procedure & Sensitive Care
                    </h3>
                  </div>
                  <p className="mt-1 text-[11px] sm:text-xs text-muted-foreground leading-relaxed">
                    Gentle healing support for delicate skin, clinical incisions, and diabetic care.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* PHASE 3: RETURN TO CENTER (0°) -> "Life happens." */}
          <motion.div
            style={{
              opacity: stage3Opacity,
              y: stage3Y,
            }}
            className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-between pb-8 pt-16 sm:pt-20 text-center"
          >
            <div>
              <h2 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight text-foreground">
                Life happens.
              </h2>
              <p className="mt-2 max-w-lg px-4 text-xs sm:text-sm text-muted-foreground">
                Keep SOLIDERMA close for when minor accidents occur at home, play, or work.
              </p>
            </div>

            <div className="pointer-events-auto flex flex-col items-center gap-2 pb-4 sm:pb-8">
              <Button
                onClick={() => scrollToSection("sizes")}
                className="h-11 sm:h-12 rounded-full bg-[color:var(--botanical-deep)] px-7 sm:px-8 text-sm font-medium text-primary-foreground shadow-md hover:bg-[color:var(--botanical)]"
              >
                Get Soliderma
              </Button>
              <p className="text-[10px] sm:text-xs text-muted-foreground/80 tracking-wide uppercase">
                Ayurvedic Proprietary Medicine • WHO-GMP Certified Quality
              </p>
            </div>
          </motion.div>

          {/* BOTTLE & SHADOW */}
          <motion.div
            style={{
              x: bottleXDesktop,
              y: "0px",
              rotate: bottleRotate,
            }}
            className="pointer-events-none relative z-10 flex flex-col items-center justify-center will-change-transform"
          >
            <img
              src={bottleSrc}
              alt={bottleAlt}
              width={700}
              height={920}
              className="h-[50vh] sm:max-h-[480px] lg:max-h-[520px] w-auto object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.12)]"
            />
            <motion.div
              style={{
                skewX: shadowSkew,
              }}
              className="-mt-1 h-3.5 w-24 sm:h-4 sm:w-36 rounded-full bg-black/12 blur-md will-change-transform"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

interface MobileScrollytellingProps {
  bottleSrc: string;
  bottleAlt: string;
  startingPrice: string;
  scrollToSection: (id: string) => void;
}

function MobileScrollytelling({
  bottleSrc,
  bottleAlt,
  startingPrice,
  scrollToSection,
}: MobileScrollytellingProps) {
  const runwayRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: runwayRef,
    offset: ["start start", "end end"],
  });

  // Mobile Horizontal Translation:
  // Phase 0: Center (0vw) [0.00 -> 0.16]
  // Phase 1: Slides to Left (-28vw) [0.16 -> 0.26], stays left until 0.44
  // Phase 2: Slides to Right (+28vw) [0.44 -> 0.54], stays right until 0.72
  // Phase 3: Returns to Center (0vw) [0.72 -> 0.82], stays center until 1.00
  const bottleX = useTransform(
    scrollYProgress,
    [0, 0.16, 0.26, 0.44, 0.54, 0.72, 0.82, 1],
    ["0vw", "0vw", "-28vw", "-28vw", "28vw", "28vw", "0vw", "0vw"]
  );

  // Subtle natural tilt for mobile
  const bottleRotate = useTransform(
    scrollYProgress,
    [0, 0.16, 0.26, 0.44, 0.54, 0.72, 0.82, 1],
    [0, 0, -4, -4, 4, 4, 0, 0]
  );

  // Phase 0: Hero State (Center)
  const heroOpacity = useTransform(scrollYProgress, [0, 0.12, 0.17, 1], [1, 1, 0, 0], {
    clamp: true,
  });
  const heroY = useTransform(scrollYProgress, [0, 0.17, 1], [0, -18, -18], { clamp: true });

  // Phase 1: Four actions, one spray (Right Side Content)
  const stage1Opacity = useTransform(
    scrollYProgress,
    [0, 0.20, 0.27, 0.44, 0.49, 1],
    [0, 0, 1, 1, 0, 0],
    { clamp: true }
  );
  const stage1Y = useTransform(
    scrollYProgress,
    [0, 0.20, 0.27, 0.44, 0.49, 1],
    [15, 15, 0, 0, -15, -15],
    { clamp: true }
  );

  // Phase 2: Everyday Wounds (Left Side Content)
  const stage2Opacity = useTransform(
    scrollYProgress,
    [0, 0.48, 0.55, 0.72, 0.77, 1],
    [0, 0, 1, 1, 0, 0],
    { clamp: true }
  );
  const stage2Y = useTransform(
    scrollYProgress,
    [0, 0.48, 0.55, 0.72, 0.77, 1],
    [15, 15, 0, 0, -15, -15],
    { clamp: true }
  );

  // Phase 3: Life Happens + CTA (Center Content)
  const stage3Opacity = useTransform(scrollYProgress, [0, 0.76, 0.83, 1], [0, 0, 1, 1], {
    clamp: true,
  });
  const stage3Y = useTransform(scrollYProgress, [0, 0.76, 0.83, 1], [15, 15, 0, 0], {
    clamp: true,
  });

  return (
    <div ref={runwayRef} className="relative h-[280vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        {/* Subtle Ambient Glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            background:
              "radial-gradient(ellipse 65% 55% at 50% 50%, rgba(38,80,56,0.12) 0%, rgba(201,168,76,0.06) 50%, transparent 80%)",
          }}
        />

        {/* MOBILE STAGE CONTAINER */}
        <div className="relative h-full w-full flex items-center justify-center px-3">
          
          {/* ===============================================================
              PHASE 0: HERO (Center)
              =============================================================== */}
          <motion.div
            style={{ opacity: heroOpacity, y: heroY }}
            className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-between pb-8 pt-24 text-center px-4"
          >
            <div>
              <p className="eyebrow tracking-[0.22em] text-[color:var(--gold)] text-[10px]">
                ANTISEPTIC FIRST AID SKIN SPRAY
              </p>
              <h1 className="mt-1 font-serif text-3xl sm:text-4xl font-normal tracking-tight text-foreground">
                SOLIDERMA<span className="text-lg align-top text-[color:var(--gold)]">™</span>
              </h1>
              <p className="mt-0.5 font-serif text-sm text-[color:var(--burgundy)]">
                Multi Action Wound Healing Spray
              </p>
            </div>

            <div className="pointer-events-auto flex flex-col items-center gap-2 pb-1">
              <p className="max-w-[280px] text-[11.5px] text-muted-foreground leading-relaxed">
                Quick action antiseptic first aid spray for wounds, cuts and burns.
              </p>
              <div className="flex items-center gap-2.5">
                <Button
                  onClick={() => scrollToSection("sizes")}
                  size="sm"
                  className="h-9 rounded-full bg-[color:var(--botanical-deep)] px-5 text-xs font-medium text-primary-foreground shadow-sm hover:bg-[color:var(--botanical)]"
                >
                  Get Soliderma
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => scrollToSection("sizes")}
                  className="h-9 rounded-full border-border bg-card px-4 text-xs font-medium hover:bg-card"
                >
                  View Details
                </Button>
              </div>
              <div className="mt-0.5 flex items-center gap-1.5 text-[10.5px] text-muted-foreground/80">
                <span>Scroll to explore</span>
                <ChevronDown className="h-3 w-3 animate-bounce" />
              </div>
            </div>
          </motion.div>

          {/* ===============================================================
              PHASE 1: BOTTLE ON LEFT -> RIGHT CONTENT
              "Four actions, one spray"
              =============================================================== */}
          <motion.div
            style={{ opacity: stage1Opacity, y: stage1Y }}
            className="pointer-events-none absolute z-20 top-1/2 -translate-y-1/2 left-[38%] right-2.5 max-w-[250px]"
          >
            <div className="rounded-xl border border-border/70 bg-card/95 p-3.5 shadow-sm backdrop-blur-sm">
              <p className="eyebrow tracking-[0.18em] text-[color:var(--gold)] text-[9.5px]">HOW IT HELPS</p>
              <h2 className="mt-0.5 font-serif text-base sm:text-lg font-normal leading-tight text-foreground">
                Four actions,<br />one spray.
              </h2>
              
              <ul className="mt-2.5 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[color:var(--botanical)]/15 text-[color:var(--botanical)]">
                    <HeartPulse className="h-2.5 w-2.5" />
                  </span>
                  <div>
                    <h3 className="font-semibold text-foreground text-[10.5px] leading-tight">Rapid wound healing</h3>
                    <p className="mt-0.5 text-[8.5px] text-muted-foreground leading-snug">
                      Accelerates tissue recovery with active extracts.
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-2">
                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[color:var(--botanical)]/15 text-[color:var(--botanical)]">
                    <ShieldCheck className="h-2.5 w-2.5" />
                  </span>
                  <div>
                    <h3 className="font-semibold text-foreground text-[10.5px] leading-tight">Antimicrobial cover</h3>
                    <p className="mt-0.5 text-[8.5px] text-muted-foreground leading-snug">
                      Forms an active protective herbal shield.
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-2">
                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[color:var(--botanical)]/15 text-[color:var(--botanical)]">
                    <Droplet className="h-2.5 w-2.5" />
                  </span>
                  <div>
                    <h3 className="font-semibold text-foreground text-[10.5px] leading-tight">Pain relief & soothing</h3>
                    <p className="mt-0.5 text-[8.5px] text-muted-foreground leading-snug">
                      Cools irritation with zero sting or burn.
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-2">
                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[color:var(--botanical)]/15 text-[color:var(--botanical)]">
                    <Sparkles className="h-2.5 w-2.5" />
                  </span>
                  <div>
                    <h3 className="font-semibold text-foreground text-[10.5px] leading-tight">Scar prevention</h3>
                    <p className="mt-0.5 text-[8.5px] text-muted-foreground leading-snug">
                      Promotes clean, healthy skin recovery.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* ===============================================================
              PHASE 2: BOTTLE ON RIGHT -> LEFT CONTENT
              "Made for everyday wounds"
              =============================================================== */}
          <motion.div
            style={{ opacity: stage2Opacity, y: stage2Y }}
            className="pointer-events-none absolute z-20 top-1/2 -translate-y-1/2 left-2.5 right-[38%] max-w-[250px]"
          >
            <div className="rounded-xl border border-border/70 bg-card/95 p-3.5 shadow-sm backdrop-blur-sm">
              <p className="eyebrow tracking-[0.18em] text-[color:var(--gold)] text-[9.5px]">WHERE TO APPLY</p>
              <h2 className="mt-0.5 font-serif text-base sm:text-lg font-normal leading-tight text-foreground">
                Made for everyday wounds
              </h2>

              <div className="mt-2.5 space-y-1.5">
                <div className="rounded-lg border border-border/60 bg-muted/30 p-2">
                  <div className="flex items-center gap-1.5">
                    <span className="flex h-4 w-4 items-center justify-center rounded bg-[color:var(--botanical)]/10 text-[color:var(--botanical)]">
                      <Scissors className="h-2.5 w-2.5" />
                    </span>
                    <h3 className="font-semibold text-foreground text-[10px]">Cuts & Scrapes</h3>
                  </div>
                  <p className="mt-0.5 text-[8.5px] text-muted-foreground leading-snug">
                    Grazes, paper cuts, kitchen accidents & abrasions.
                  </p>
                </div>

                <div className="rounded-lg border border-border/60 bg-muted/30 p-2">
                  <div className="flex items-center gap-1.5">
                    <span className="flex h-4 w-4 items-center justify-center rounded bg-[color:var(--botanical)]/10 text-[color:var(--botanical)]">
                      <Flame className="h-2.5 w-2.5" />
                    </span>
                    <h3 className="font-semibold text-foreground text-[10px]">Burns & Scalds</h3>
                  </div>
                  <p className="mt-0.5 text-[8.5px] text-muted-foreground leading-snug">
                    Instant cooling relief for steam & accidental burns.
                  </p>
                </div>

                <div className="rounded-lg border border-border/60 bg-muted/30 p-2">
                  <div className="flex items-center gap-1.5">
                    <span className="flex h-4 w-4 items-center justify-center rounded bg-[color:var(--botanical)]/10 text-[color:var(--botanical)]">
                      <Shield className="h-2.5 w-2.5" />
                    </span>
                    <h3 className="font-semibold text-foreground text-[10px]">Delicate & Sensitive</h3>
                  </div>
                  <p className="mt-0.5 text-[8.5px] text-muted-foreground leading-snug">
                    Gentle healing support for delicate skin care.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ===============================================================
              PHASE 3: BOTTLE RETURNS TO CENTER ("After centre")
              Header at top, Bottle centered, Callout card at bottom
              =============================================================== */}
          <motion.div
            style={{ opacity: stage3Opacity, y: stage3Y }}
            className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-between pb-8 pt-24 text-center px-4"
          >
            {/* Top Heading */}
            <div>
              <h2 className="font-serif text-2xl font-normal tracking-tight text-foreground">
                Life happens.
              </h2>
              <p className="mt-1 max-w-[260px] text-xs text-muted-foreground leading-snug">
                Keep SOLIDERMA close for when minor accidents occur.
              </p>
            </div>

            {/* Bottom Callout Card - matching user's reference image */}
            <div className="pointer-events-auto w-full max-w-[300px] rounded-2xl border border-border/80 bg-card/95 p-3.5 shadow-lg backdrop-blur-sm flex flex-col items-center gap-2">
              <div className="flex items-baseline justify-between w-full px-1">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Starting at</span>
                <span className="font-serif text-base font-bold text-foreground">{startingPrice}</span>
              </div>
              <Button
                onClick={() => scrollToSection("sizes")}
                className="w-full h-9 rounded-full bg-[color:var(--botanical-deep)] text-xs font-semibold tracking-wide text-primary-foreground shadow-sm hover:bg-[color:var(--botanical)]"
              >
                Get Soliderma
              </Button>
              <p className="text-[9px] text-muted-foreground/80 tracking-wide uppercase">
                Ayurvedic Proprietary Medicine • WHO-GMP Certified
              </p>
            </div>
          </motion.div>

          {/* ===============================================================
              THE PRODUCT BOTTLE & SHADOW
              Transforms across Center -> Left -> Right -> Center
              =============================================================== */}
          <motion.div
            style={{
              x: bottleX,
              rotate: bottleRotate,
            }}
            className="pointer-events-none relative z-10 flex flex-col items-center justify-center will-change-transform"
          >
            <img
              src={bottleSrc}
              alt={bottleAlt}
              width={700}
              height={920}
              className="h-[30vh] max-h-[235px] w-auto object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.12)]"
            />
            {/* Separate contact shadow */}
            <div className="-mt-1 h-3 w-20 rounded-full bg-black/12 blur-sm" />
          </motion.div>

        </div>
      </div>
    </div>
  );
}

export function Soliderma() {
  const { product, content } = Route.useLoaderData();
  const ingredients = preferSaved(content?.ingredients ?? [], INGREDIENTS);

  // Use the merchant's live Shopify product image everywhere
  const bottleSrc = product?.featuredImage
    ? sizedImage(product.featuredImage.url, 1200)
    : bottle;
  const smallBottleSrc = product?.featuredImage
    ? sizedImage(product.featuredImage.url, 400)
    : bottle;
  const bottleAlt = product
    ? imageAlt(product.featuredImage?.altText ?? null, product)
    : "Soliderma multi action wound healing spray bottle";

  const startingPrice = product?.priceRange?.minVariantPrice
    ? formatMoney(product.priceRange.minVariantPrice)
    : "₹395";

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="relative bg-[color:var(--surface)]">
      {/* =========================================================================
          DESKTOP SCROLLYTELLING RUNWAY (Preserved 100% untouched for md+)
          ========================================================================= */}
      <div className="hidden md:block">
        <DesktopScrollytelling
          bottleSrc={bottleSrc}
          bottleAlt={bottleAlt}
          scrollToSection={scrollToSection}
        />
      </div>

      {/* =========================================================================
          MOBILE SCROLLYTELLING RUNWAY (Center -> Left Bottle / Right Content -> Right Bottle / Left Content -> Center)
          ========================================================================= */}
      <div className="block md:hidden">
        <MobileScrollytelling
          bottleSrc={bottleSrc}
          bottleAlt={bottleAlt}
          startingPrice={startingPrice}
          scrollToSection={scrollToSection}
        />
      </div>

      {/* =========================================================================
          SECTION: THREE SIMPLE STEPS (Directly from Reference Frame 7)
          ========================================================================= */}
      <section className="border-t border-border/80 bg-[color:var(--surface)] py-16 sm:py-20 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="eyebrow tracking-[0.2em] text-[color:var(--gold)]">
              SIMPLE APPLICATION
            </p>
            <h2 className="mt-2 font-serif text-3xl sm:text-5xl font-normal text-foreground">
              Three simple steps
            </h2>
            <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
              Gentle, touch-free wound care engineered for rapid recovery and soothing comfort.
            </p>
          </div>

          <div className="mt-12 sm:mt-14 grid gap-6 sm:grid-cols-3">
            {/* Step 1 */}
            <Reveal delay={0}>
              <div className="group h-full rounded-2xl border border-border bg-card p-6 sm:p-7 shadow-sm transition-all hover:border-[color:var(--botanical)]/40 hover:shadow-md">
                <span className="font-serif text-3xl sm:text-4xl font-normal text-[color:var(--gold)]">
                  01
                </span>
                <h3 className="mt-3 font-serif text-xl sm:text-2xl font-normal text-foreground">Clean</h3>
                <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Cleanse the affected wound area gently with clean water or mild sterile saline
                  solution to remove dirt and particles.
                </p>
                <div className="mt-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[color:var(--botanical)]">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Prepare surface</span>
                </div>
              </div>
            </Reveal>

            {/* Step 2 */}
            <Reveal delay={0.1}>
              <div className="group h-full rounded-2xl border border-border bg-card p-6 sm:p-7 shadow-sm transition-all hover:border-[color:var(--botanical)]/40 hover:shadow-md">
                <span className="font-serif text-3xl sm:text-4xl font-normal text-[color:var(--gold)]">
                  02
                </span>
                <h3 className="mt-3 font-serif text-xl sm:text-2xl font-normal text-foreground">Spray</h3>
                <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Hold the bottle 10–15cm away from the skin and spray 2–3 times to create a uniform,
                  cooling antimicrobial film.
                </p>
                <div className="mt-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[color:var(--botanical)]">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Touch-free mist</span>
                </div>
              </div>
            </Reveal>

            {/* Step 3 */}
            <Reveal delay={0.2}>
              <div className="group h-full rounded-2xl border border-border bg-card p-6 sm:p-7 shadow-sm transition-all hover:border-[color:var(--botanical)]/40 hover:shadow-md">
                <span className="font-serif text-3xl sm:text-4xl font-normal text-[color:var(--gold)]">
                  03
                </span>
                <h3 className="mt-3 font-serif text-xl sm:text-2xl font-normal text-foreground">Let it heal</h3>
                <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Allow the herbal formula to absorb naturally without touching or rubbing. Repeat
                  2–3 times daily until fully recovered.
                </p>
                <div className="mt-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[color:var(--botanical)]">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Natural regeneration</span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION: AVAILABLE PRODUCT SIZES & ADD TO CART (E-commerce Integration)
          ========================================================================= */}
      <section id="sizes" className="border-t border-border bg-background py-16 sm:py-20 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="text-center sm:text-left">
            <SectionLabel index="02" label="Product Sizes" />
            <h2 className="mt-4 font-serif text-3xl sm:text-4xl text-foreground">
              Select Your Size
            </h2>
            <p className="mt-2 text-muted-foreground">
              Ayurvedic proprietary formulation in convenient no-touch spray bottles.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {product?.variants.map((v, i) => (
              <Reveal key={v.id} delay={i * 0.08}>
                <div className="flex h-full flex-col justify-between rounded-2xl border border-border bg-card p-7 sm:p-8 shadow-sm transition-all hover:border-[color:var(--botanical)]/50">
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="font-serif text-xl sm:text-2xl text-foreground">
                        {variantLabel(v.title) || v.title}
                      </h3>
                      <span className="rounded-full bg-[color:var(--botanical)]/10 px-3 py-1 text-xs font-medium text-[color:var(--botanical)]">
                        {v.availableForSale ? "In Stock" : "Out of Stock"}
                      </span>
                    </div>
                    <p className="mt-3 font-display text-2xl font-medium text-foreground">
                      {formatMoney(v.price)}
                    </p>
                    <p className="mt-2 text-xs sm:text-sm text-muted-foreground">
                      Pocket and travel-ready bottle. Multi-action antiseptic skin mist.
                    </p>
                  </div>

                  <div className="mt-8 pt-6 border-t border-border/70">
                    <AddToCart product={product} variants={[v]} />
                  </div>
                </div>
              </Reveal>
            ))}

            {!product && (
              <div className="col-span-2 rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground">
                <p>Sizes and pricing are being updated in the catalogue.</p>
                <Link
                  to="/contact"
                  className="mt-3 inline-block font-medium text-[color:var(--burgundy)] underline"
                >
                  Contact our pharmacy team to place an order
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION: INGREDIENTS & AYURVEDIC FORMULATION
          ========================================================================= */}
      <section className="bg-[color:var(--surface)] py-16 sm:py-20 px-6 border-t border-border">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="eyebrow text-[color:var(--gold)]">03</span>
              <span className="h-px w-8 bg-border" />
              <span className="eyebrow text-muted-foreground">Formulation Details</span>
            </div>
            <h2 className="mt-4 font-serif text-3xl sm:text-4xl text-foreground leading-tight">
              Pure Ayurvedic Botanicals & Active Bio-Compounds
            </h2>
            <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
              Developed through documented Ayurvedic preparation processes involving extraction,
              purification, and micro-filtration for safe cutaneous application.
            </p>

            <ul className="mt-8 divide-y divide-border border-t border-border">
              {ingredients.map((item) => (
                <li key={item.name} className="grid grid-cols-[1.2fr_1.4fr_auto] gap-3 py-3.5 text-xs sm:text-sm">
                  <span className="font-semibold text-foreground">{item.name}</span>
                  <span className="italic text-muted-foreground">{item.latin}</span>
                  <span className="text-xs font-medium text-muted-foreground/80">{item.part}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="relative overflow-hidden rounded-2xl border border-border shadow-sm">
              <img
                src={botanicals}
                alt="Natural Ayurvedic botanicals used in Soliderma"
                width={1408}
                height={1008}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <p className="text-xs font-semibold uppercase tracking-widest text-[color:var(--gold)]">
                  Traditional Heritage
                </p>
                <p className="mt-1 font-serif text-base sm:text-lg">WHO-GMP Batch Tested Quality Assurance</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* =========================================================================
          SECTION: PRODUCT FAQS
          ========================================================================= */}
      {content && content.faqs.length > 0 && (
        <section className="bg-background py-16 sm:py-20 px-6 border-t border-border">
          <div className="mx-auto max-w-3xl">
            <div className="text-center">
              <SectionLabel index="04" label="Frequently Asked Questions" />
              <h2 className="mt-4 font-serif text-3xl sm:text-4xl text-foreground">
                Common Questions
              </h2>
            </div>

            <div className="mt-10">
              <Accordion type="single" collapsible className="w-full">
                {content.faqs.map((f, i) => (
                  <AccordionItem key={f.q} value={`item-${i}`}>
                    <AccordionTrigger className="text-left font-serif text-base sm:text-lg">
                      {f.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
                      {f.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          SECTION: DEEP BOTANICAL GREEN FOOTER / CTA (Directly from Reference Frame 8)
          ========================================================================= */}
      <section className="relative overflow-hidden bg-[color:var(--botanical-deep)] px-6 py-20 sm:py-24 text-center text-primary-foreground">
        <div className="relative mx-auto max-w-2xl flex flex-col items-center">
          {/* Centered Small Soliderma Bottle */}
          <img
            src={smallBottleSrc}
            alt={bottleAlt}
            width={300}
            height={420}
            className="h-28 sm:h-36 w-auto object-contain drop-shadow-md"
          />

          {/* Heading and Subtitle */}
          <h2 className="mt-6 font-serif text-3xl sm:text-5xl font-normal tracking-wide text-primary-foreground">
            SOLIDERMA<span className="text-sm align-top text-[color:var(--gold)]">™</span>
          </h2>
          <p className="mt-3 text-xs sm:text-base text-primary-foreground/80 leading-relaxed max-w-lg">
            A herbal wound-care spray developed around an Ayurvedic proprietary formulation.
          </p>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button
              onClick={() => scrollToSection("sizes")}
              className="h-11 sm:h-12 rounded-full bg-primary-foreground px-7 sm:px-8 text-xs sm:text-sm font-medium text-[color:var(--botanical-deep)] shadow-md hover:bg-[color:var(--ivory)]"
            >
              Order Soliderma
            </Button>
            <Link
              to="/contact"
              className="inline-flex h-11 sm:h-12 items-center rounded-full border border-primary-foreground/30 px-6 sm:px-7 text-xs sm:text-sm font-medium text-primary-foreground hover:bg-primary-foreground/10"
            >
              Enquire for Clinics
            </Link>
          </div>

          {/* Trust Badges Bar */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4 sm:gap-6 border-t border-primary-foreground/15 pt-8 text-[11px] sm:text-xs text-primary-foreground/70">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-[color:var(--gold)]" /> AYUSH Licensed
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-[color:var(--gold)]" /> WHO-GMP Facility
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Leaf className="h-3.5 w-3.5 text-[color:var(--gold)]" /> 100% Herbal Actives
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}

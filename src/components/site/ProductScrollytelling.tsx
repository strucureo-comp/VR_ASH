import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { resolveIcon } from "@/lib/content/icons";

export interface ProductScrollytellingProps {
  bottleSrc: string;
  bottleAlt: string;
  howItHelpsTitle?: string;
  benefits?: Array<{ title: string; body: string }>;
  whereToApplyTitle?: string;
  conditions?: Array<{ title: string; body: string; icon?: string }>;
}

export function DesktopScrollytelling({
  bottleSrc,
  bottleAlt,
  howItHelpsTitle = "Four actions, one spray.",
  benefits = [],
  whereToApplyTitle = "Made for everyday wounds",
  conditions = [],
}: ProductScrollytellingProps) {
  const runwayRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: runwayRef,
    offset: ["start start", "end end"],
  });

  const bottleXDesktop = useTransform(
    scrollYProgress,
    [0, 0.2, 0.4, 0.6, 0.8, 1],
    ["-200px", "-200px", "200px", "200px", "0px", "0px"]
  );

  const bottleRotate = useTransform(
    scrollYProgress,
    [0, 0.2, 0.4, 0.6, 0.8, 1],
    [-6, -6, 6, 6, 0, 0]
  );

  const stage1Opacity = useTransform(
    scrollYProgress,
    [0, 0.05, 0.35, 0.45],
    [0, 1, 1, 0],
    { clamp: true }
  );
  const stage1Y = useTransform(
    scrollYProgress,
    [0, 0.05, 0.35, 0.45],
    [25, 0, 0, -25],
    { clamp: true }
  );

  const stage2Opacity = useTransform(
    scrollYProgress,
    [0.35, 0.45, 0.8, 0.9],
    [0, 1, 1, 0],
    { clamp: true }
  );
  const stage2Y = useTransform(
    scrollYProgress,
    [0.35, 0.45, 0.8, 0.9],
    [25, 0, 0, -25],
    { clamp: true }
  );

  return (
    <div ref={runwayRef} className="relative h-[200vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        <div className="relative mx-auto flex h-full w-full max-w-6xl items-center justify-center px-4 sm:px-6">
          
          {/* PHASE 1: HOW IT HELPS */}
          <motion.div
            style={{ opacity: stage1Opacity, y: stage1Y }}
            className="pointer-events-none absolute z-20 w-full max-w-sm md:max-w-md lg:max-w-lg top-1/2 -translate-y-1/2 left-[calc(50%+48px)] right-auto"
          >
            <div className="border-0 bg-transparent p-0 shadow-none">
              <p className="eyebrow tracking-[0.2em] text-[color:var(--gold)]">PHYSIOLOGICAL MECHANISM</p>
              <h2 className="mt-1 font-serif text-2xl sm:text-4xl lg:text-5xl font-normal leading-tight text-foreground" dangerouslySetInnerHTML={{ __html: howItHelpsTitle }} />
              <ul className="mt-4 sm:mt-6 space-y-3 sm:space-y-4">
                {benefits.slice(0, 4).map((b, i) => (
                  <li key={i} className="flex items-start gap-3 pointer-events-auto">
                    <span className="mt-0.5 flex h-5 w-5 sm:h-6 sm:w-6 shrink-0 items-center justify-center rounded-full bg-[color:var(--botanical)]/15 text-[color:var(--botanical)]">
                      <CheckCircle2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                    </span>
                    <div>
                      <h3 className="font-semibold text-foreground text-xs sm:text-sm">{b.title}</h3>
                      <p className="mt-0.5 text-[11px] sm:text-xs text-muted-foreground leading-relaxed">
                        {b.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* PHASE 2: WHERE TO APPLY */}
          <motion.div
            style={{ opacity: stage2Opacity, y: stage2Y }}
            className="pointer-events-none absolute z-20 w-full max-w-sm md:max-w-md lg:max-w-lg top-1/2 -translate-y-1/2 right-[calc(50%+48px)] left-auto"
          >
            <div className="border-0 bg-transparent p-0 shadow-none">
              <p className="eyebrow tracking-[0.2em] text-[color:var(--gold)]">CLINICAL INDICATIONS</p>
              <h2 className="mt-1 font-serif text-2xl sm:text-4xl lg:text-5xl font-normal leading-tight text-foreground" dangerouslySetInnerHTML={{ __html: whereToApplyTitle }} />
              <div className="mt-4 sm:mt-6 space-y-2.5 sm:space-y-3 pointer-events-auto">
                {conditions.slice(0, 3).map((c, i) => {
                  const Icon = resolveIcon(c.icon ?? "");
                  return (
                    <div key={i} className="rounded-xl border border-border/80 bg-card/90 p-3 sm:p-4 shadow-sm">
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[color:var(--botanical)]/10 text-[color:var(--botanical)]">
                          <Icon className="h-3.5 w-3.5" />
                        </span>
                        <h3 className="font-semibold text-foreground text-xs sm:text-sm">{c.title}</h3>
                      </div>
                      <p className="mt-1 text-[11px] sm:text-xs text-muted-foreground leading-relaxed">{c.body}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* BOTTLE */}
          <motion.div
            style={{ x: bottleXDesktop, y: "0px", rotate: bottleRotate }}
            className="pointer-events-none relative z-10 flex flex-col items-center justify-center will-change-transform"
          >
            <img src={bottleSrc} alt={bottleAlt} width={700} height={920} className="h-[50vh] sm:max-h-[480px] lg:max-h-[520px] w-auto object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.12)]" />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function MobileMechanismPhase({
  bottleSrc,
  bottleAlt,
  howItHelpsTitle,
  benefits,
}: {
  bottleSrc: string;
  bottleAlt: string;
  howItHelpsTitle: string;
  benefits: Array<{ title: string; body: string }>;
}) {
  const runwayRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: runwayRef,
    offset: ["start start", "end end"],
  });

  const cardOpacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);
  const cardY = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [20, 0, 0, -20]);

  return (
    <div ref={runwayRef} className="relative h-[120vh]">
      <div className="sticky top-[10svh] h-[80svh] w-full overflow-hidden flex items-center justify-center">
        <div className="relative mx-auto flex h-full w-full max-w-sm items-center justify-center px-4">
          <motion.div
            id="actions-mobile"
            style={{ opacity: cardOpacity, y: cardY }}
            className="pointer-events-none absolute z-20 w-[60%] right-3 top-1/2 -translate-y-[45%]"
          >
            <div className="rounded-2xl border border-border/70 bg-card/95 p-4 shadow-md backdrop-blur-sm pointer-events-auto">
              <p className="eyebrow tracking-[0.18em] text-[color:var(--gold)] text-[10.5px] font-bold">
                PHYSIOLOGICAL MECHANISM
              </p>
              <h2
                className="mt-1 font-serif text-base sm:text-lg font-normal leading-tight text-foreground"
                dangerouslySetInnerHTML={{ __html: howItHelpsTitle }}
              />

              <ul className="mt-3 space-y-2">
                {benefits.slice(0, 4).map((b, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[color:var(--botanical)]/15 text-[color:var(--botanical)]">
                      <CheckCircle2 className="h-2.5 w-2.5" />
                    </span>
                    <div>
                      <h3 className="font-semibold text-foreground text-[11px] leading-tight">{b.title}</h3>
                      <p className="mt-0.5 text-[9.5px] text-muted-foreground/90 leading-tight line-clamp-2">
                        {b.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          <div className="pointer-events-none relative z-10 flex flex-col items-center justify-center -translate-x-[24vw] mt-[4vh]">
            <img
              src={bottleSrc}
              alt={bottleAlt}
              width={450}
              height={650}
              className="max-h-[44vh] w-auto object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.12)]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function AnimatedStackedIndicationCard({
  i,
  step,
  title,
  body,
  icon: Icon,
  progress,
  total,
}: {
  i: number;
  step: string;
  title: string;
  body: string;
  icon: any;
  progress: MotionValue<number>;
  total: number;
}) {
  const slot = 0.88 / Math.max(1, total - 1);
  const start = i === 0 ? 0 : 0.05 + (i - 1) * slot;
  const end = i === 0 ? 0 : start + slot;
  const fadeEnd = i === 0 ? 0 : start + slot * 0.35;

  // Initial visibility: Card 0 is 100% visible immediately.
  // Cards 1..n start at 0 opacity and only fade in when their scroll slot arrives.
  const enterOpacity = useTransform(
    progress,
    i === 0 ? [0, 1] : [start, fadeEnd],
    i === 0 ? [1, 1] : [0, 1],
    { clamp: true }
  );

  // Content dims slightly when covered by next card so text never looks awkwardly sliced
  const nextStart = 0.05 + i * slot;
  const coverDim = useTransform(
    progress,
    i < total - 1 ? [nextStart, nextStart + slot * 0.4] : [0.95, 1],
    i < total - 1 ? [1, 0.45] : [1, 1],
    { clamp: true }
  );

  const opacity = useTransform(
    [enterOpacity, coverDim],
    ([enter, dim]: number[]) => enter * dim
  );

  const y = useTransform(
    progress,
    i === 0 ? [0, 1] : [start, end],
    i === 0 ? [0, 0] : [320, 0],
    { clamp: true }
  );

  const targetScale = Math.max(0.90, 1 - (total - i - 1) * 0.02);
  const scale = useTransform(
    progress,
    [Math.max(end, 0.05), 0.95],
    [1, targetScale],
    { clamp: true }
  );

  return (
    <motion.div
      style={{
        opacity,
        y,
        scale,
        top: `${i * 14}px`,
        zIndex: 20 + i,
      }}
      className="absolute w-[92%] max-w-[440px] origin-top flex flex-col overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-xl transition-colors"
    >
      <div className="flex items-center justify-between">
        <span className="font-serif text-2xl font-normal text-[color:var(--gold)]">
          {step}
        </span>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[color:var(--botanical)]/10 text-[color:var(--botanical)]">
          <Icon className="h-4 w-4" />
        </span>
      </div>

      <h3 className="mt-2.5 font-serif text-lg font-normal text-foreground">
        {title}
      </h3>

      <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
        {body}
      </p>

      <div className="mt-3.5 flex items-center gap-2 text-[10.5px] font-semibold uppercase tracking-wider text-[color:var(--botanical)]">
        <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
        <span>Clinical Indication</span>
      </div>
    </motion.div>
  );
}

function MobileStackedIndicationsPhase({
  whereToApplyTitle,
  conditions,
}: {
  whereToApplyTitle: string;
  conditions: Array<{ title: string; body: string; icon?: string }>;
}) {
  const runwayRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  const [scrollBounds, setScrollBounds] = useState({ start: 0, end: 1000 });

  const total = Math.max(1, conditions.length);
  const runwayHeight = `${Math.max(175, 55 + total * 30)}vh`;

  useEffect(() => {
    const measure = () => {
      if (!runwayRef.current || !stageRef.current) return;
      const runwayRect = runwayRef.current.getBoundingClientRect();
      const stageRect = stageRef.current.getBoundingClientRect();
      const currentScroll = window.scrollY;

      const runwayTop = runwayRect.top + currentScroll;
      const runwayH = runwayRef.current.offsetHeight;
      const stageH = stageRect.height;
      const navOffset = window.innerWidth >= 640 ? 96 : 86;

      const start = runwayTop - navOffset;
      const end = runwayTop + runwayH - (navOffset + stageH);

      setScrollBounds({
        start: Math.max(0, start),
        end: Math.max(start + 50, end),
      });
    };

    measure();
    window.addEventListener("resize", measure, { passive: true });
    window.addEventListener("load", measure, { passive: true });
    const timer1 = setTimeout(measure, 300);
    const timer2 = setTimeout(measure, 800);
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("load", measure);
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const progress = useTransform(
    scrollY,
    [scrollBounds.start, scrollBounds.end],
    [0, 1],
    { clamp: true }
  );

  return (
    <div
      ref={runwayRef}
      className="relative w-full bg-[color:var(--surface)]"
      style={{ height: runwayHeight }}
    >
      {/* Pinned Stage: Stays locked under navbar */}
      <div
        ref={stageRef}
        className="sticky top-[86px] sm:top-[96px] w-full flex flex-col items-center z-10 pt-3 pb-6"
      >
        {/* Title Header - Never moves, always constant */}
        <div className="w-full text-center px-4 shrink-0">
          <p className="eyebrow tracking-[0.2em] text-[color:var(--gold)] text-xs font-semibold">
            CLINICAL INDICATIONS
          </p>
          <h2
            className="mt-1 font-serif text-xl sm:text-2xl leading-tight text-foreground"
            dangerouslySetInnerHTML={{ __html: whereToApplyTitle }}
          />
          <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
            Formulated for complex wounds requiring disciplined topical care.
          </p>
        </div>

        {/* Card Deck Area - Cards stack in single slot below title */}
        <div className="relative w-full flex justify-center mt-3 h-[250px] sm:h-[280px]">
          {conditions.map((c, i) => {
            const step = String(i + 1).padStart(2, "0");
            const Icon = resolveIcon(c.icon ?? "");
            return (
              <AnimatedStackedIndicationCard
                key={c.title || i}
                i={i}
                step={step}
                title={c.title}
                body={c.body}
                icon={Icon}
                progress={progress}
                total={total}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function MobileScrollytelling({
  bottleSrc,
  bottleAlt,
  howItHelpsTitle = "Four actions,<br />one spray.",
  benefits = [],
  whereToApplyTitle = "Made for everyday<br />wounds",
  conditions = [],
}: ProductScrollytellingProps) {
  return (
    <div className="w-full">
      {benefits.length > 0 && (
        <MobileMechanismPhase
          bottleSrc={bottleSrc}
          bottleAlt={bottleAlt}
          howItHelpsTitle={howItHelpsTitle}
          benefits={benefits}
        />
      )}

      {conditions.length > 0 && (
        <MobileStackedIndicationsPhase
          whereToApplyTitle={whereToApplyTitle}
          conditions={conditions}
        />
      )}
    </div>
  );
}

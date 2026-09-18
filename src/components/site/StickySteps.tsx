import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";
import { CheckCircle2 } from "lucide-react";

export interface StepItem {
  step: string;
  title: string;
  body: string;
  action?: string;
}

export interface StickyStepsProps {
  steps?: StepItem[];
  eyebrow?: string;
  title?: string;
  subtitle?: string;
}

const DEFAULT_STEPS: StepItem[] = [
  {
    step: "01",
    title: "Shake Well",
    body: "Shake well before each application.",
    action: "Preparation",
  },
  {
    step: "02",
    title: "Spray Generously",
    body: "Spray generously to ensure complete coverage of the wound bed.",
    action: "Touch-free application",
  },
  {
    step: "03",
    title: "Apply 3-4 Times Daily",
    body: "Apply 3 to 4 times daily, or as advised by a medical professional.",
    action: "Consistent Care",
  },
  {
    step: "04",
    title: "Medical Dressings",
    body: "Suitable for use under medical dressings as part of structured wound care.",
    action: "Clinical Compatibility",
  },
];

const STEP_ACTIONS: Record<string, string> = {
  "01": "Preparation",
  "02": "Touch-free application",
  "03": "Consistent Care",
  "04": "Clinical Compatibility",
  "Shake Well": "Preparation",
  "Spray Generously": "Touch-free application",
  "Apply 3–4 Times Daily": "Consistent Care",
  "Apply 3-4 Times Daily": "Consistent Care",
  "Medical Dressings": "Clinical Compatibility",
};

interface StickyStepCardProps {
  i: number;
  step: string;
  title: string;
  body: string;
  action: string;
  progress: MotionValue<number>;
  range: [number, number];
  targetScale: number;
  total: number;
}

const StickyStepCard = ({
  i,
  step,
  title,
  body,
  action,
  progress,
  range,
  targetScale,
  total,
}: StickyStepCardProps) => {
  const scale = useTransform(progress, range, [1, targetScale], { clamp: true });
  // Deck sticks right below the sticky title (≈84px navbar + ≈106px title).
  // 80px stagger keeps each buried card's number + title peeking out.
  const stickyTop = 190 + i * 80;

  return (
    <div
      className="sticky flex w-full justify-center px-4"
      style={{
        top: `${stickyTop}px`,
        zIndex: 10 + i,
        marginBottom: i === total - 1 ? "0px" : "24px",
      }}
    >
      <motion.div
        style={{ scale }}
        className="w-full max-w-[420px] origin-top flex flex-col rounded-2xl border border-border/80 bg-card p-5 shadow-[0_-4px_20px_rgba(0,0,0,0.06),0_10px_25px_rgba(0,0,0,0.08)]"
      >
        <span className="font-serif text-3xl font-normal text-[color:var(--gold)]">{step}</span>
        <h3 className="mt-2.5 font-serif text-xl font-normal text-foreground">{title}</h3>
        <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">{body}</p>
        <div className="mt-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[color:var(--botanical)]">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{action}</span>
        </div>
      </motion.div>
    </div>
  );
};

export const StickySteps = ({
  steps = DEFAULT_STEPS,
  eyebrow = "SIMPLE APPLICATION",
  title = "Four simple steps",
  subtitle = "Gentle, touch-free wound care engineered for rapid recovery and soothing comfort.",
}: StickyStepsProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const resolvedSteps = (steps.length > 0 ? steps : DEFAULT_STEPS).map((s) => ({
    ...s,
    action: s.action || STEP_ACTIONS[s.step] || STEP_ACTIONS[s.title] || "Application Step",
  }));

  const total = resolvedSteps.length;

  return (
    <div className="w-full">
      {/* =========================================================================
          DESKTOP VIEW: Static 4-Column Grid (No card stacking animation on desktop)
          ========================================================================= */}
      <div className="hidden md:block w-full py-16 sm:py-20 bg-[color:var(--surface)] border-t border-b border-border/70">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center max-w-2xl mx-auto">
            <p className="eyebrow tracking-[0.2em] text-[color:var(--gold)] text-xs font-semibold">
              {eyebrow}
            </p>
            <h2 className="mt-2 font-serif text-3xl sm:text-4xl text-foreground font-normal">
              {title}
            </h2>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{subtitle}</p>
          </div>

          <div
            className={`mt-12 grid gap-6 ${
              resolvedSteps.length === 3
                ? "grid-cols-1 sm:grid-cols-3"
                : resolvedSteps.length === 2
                  ? "grid-cols-1 sm:grid-cols-2"
                  : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
            }`}
          >
            {resolvedSteps.map((stepData) => (
              <div
                key={stepData.step}
                className="flex flex-col justify-between rounded-2xl border border-border bg-card p-6 sm:p-7 shadow-sm transition-all hover:border-[color:var(--botanical)]/50 hover:shadow-md hover:-translate-y-1"
              >
                <div>
                  <span className="font-serif text-3xl sm:text-4xl text-[color:var(--gold)]">
                    {stepData.step}
                  </span>
                  <h3 className="mt-3 font-serif text-xl text-foreground">{stepData.title}</h3>
                  <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {stepData.body}
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[color:var(--botanical)] pt-4 border-t border-border/60">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>{stepData.action}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* =========================================================================
          MOBILE VIEW: Skiper16 sticky card deck.
          Deep 80px stagger so each buried card keeps its number + title
          peeking above the next card (Image 1 showed bodies cut with a
          shallow stagger). Title stays sticky under the navbar; small pb-8
          tail so no beige void sits below the finished stack (Image 2).
          ========================================================================= */}
      <div className="block md:hidden w-full">
        <section
          ref={containerRef}
          className="relative w-full bg-[color:var(--surface)] border-t border-b border-border/70 pb-8"
        >
          {/* Sticky header - locks beneath navbar while cards stack */}
          <div className="sticky top-[84px] z-30 bg-[color:var(--surface)] pt-3 pb-3 px-4 text-center">
            <p className="eyebrow tracking-[0.2em] text-[color:var(--gold)] text-xs font-semibold">
              {eyebrow}
            </p>
            <h2 className="mt-1 font-serif text-2xl font-normal text-foreground">{title}</h2>
            <p className="mt-1 text-xs text-muted-foreground max-w-xl mx-auto leading-relaxed">
              {subtitle}
            </p>
          </div>

          <div className="relative w-full mt-4 flex flex-col">
            {resolvedSteps.map((stepData, i) => {
              const targetScale = Math.max(0.9, 1 - (total - i - 1) * 0.04);
              const range: [number, number] = [total > 1 ? i / total : 0, 1];

              return (
                <StickyStepCard
                  key={stepData.step}
                  i={i}
                  {...stepData}
                  progress={scrollYProgress}
                  range={range}
                  targetScale={targetScale}
                  total={total}
                />
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};

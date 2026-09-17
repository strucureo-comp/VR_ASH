import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import React, { useEffect, useRef, useState } from "react";
import { CheckCircle2 } from "lucide-react";

const steps = [
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

interface AnimatedCardProps {
  i: number;
  step: string;
  title: string;
  body: string;
  action: string;
  progress: MotionValue<number>;
  total: number;
}

const AnimatedStepCard = ({
  i,
  step,
  title,
  body,
  action,
  progress,
  total,
}: AnimatedCardProps) => {
  const slot = 0.88 / Math.max(1, total - 1);
  const start = i === 0 ? 0 : 0.05 + (i - 1) * slot;
  const end = i === 0 ? 0 : start + slot;
  const fadeEnd = i === 0 ? 0 : start + slot * 0.35;

  // Initial visibility: Card 0 is 100% visible immediately.
  // Cards 1, 2, 3 start at 0 opacity and only fade in when their scroll slot arrives.
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

  // Combined opacity: enter fade multiplied by cover dimming
  const opacity = useTransform(
    [enterOpacity, coverDim],
    ([enter, dim]: number[]) => enter * dim
  );

  // Translation: slides up from below into the deck
  const y = useTransform(
    progress,
    i === 0 ? [0, 1] : [start, end],
    i === 0 ? [0, 0] : [320, 0],
    { clamp: true }
  );

  // Subtle scale-down as cards layer on top
  const targetScale = Math.max(0.91, 1 - (total - i - 1) * 0.03);
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
      className="absolute w-[92%] max-w-[450px] origin-top flex flex-col overflow-hidden rounded-2xl sm:rounded-[2rem] border border-border bg-card p-6 sm:p-8 shadow-xl transition-colors"
    >
      <span className="font-serif text-3xl sm:text-5xl font-normal text-[color:var(--gold)]">
        {step}
      </span>
      <h3 className="mt-2.5 sm:mt-3 font-serif text-xl sm:text-3xl font-normal text-foreground">
        {title}
      </h3>
      <p className="mt-1.5 sm:mt-2 text-xs sm:text-base text-muted-foreground leading-relaxed">
        {body}
      </p>
      <div className="mt-4 sm:mt-6 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[color:var(--botanical)]">
        <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
        <span>{action}</span>
      </div>
    </motion.div>
  );
};

export const StickySteps = () => {
  const runwayRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  const [scrollBounds, setScrollBounds] = useState({ start: 0, end: 1000 });

  useEffect(() => {
    const measure = () => {
      if (!runwayRef.current || !stageRef.current) return;
      const runwayRect = runwayRef.current.getBoundingClientRect();
      const stageRect = stageRef.current.getBoundingClientRect();
      const currentScroll = window.scrollY;

      const runwayTop = runwayRect.top + currentScroll;
      const runwayHeight = runwayRef.current.offsetHeight;
      const stageHeight = stageRect.height;
      const navOffset = window.innerWidth >= 640 ? 96 : 86;

      const start = runwayTop - navOffset;
      const end = runwayTop + runwayHeight - (navOffset + stageHeight);

      setScrollBounds({
        start: Math.max(0, start),
        end: Math.max(start + 50, end),
      });
    };

    measure();
    window.addEventListener("resize", measure, { passive: true });
    const timer = setTimeout(measure, 500);
    return () => {
      window.removeEventListener("resize", measure);
      clearTimeout(timer);
    };
  }, []);

  const progress = useTransform(
    scrollY,
    [scrollBounds.start, scrollBounds.end],
    [0, 1],
    { clamp: true }
  );

  return (
    <section ref={runwayRef} className="relative w-full bg-[color:var(--surface)] h-[185vh] sm:h-[200vh]">
      {/* Pinned Stage: Stays locked under navbar for entire stacking animation */}
      <div
        ref={stageRef}
        className="sticky top-[86px] sm:top-[96px] w-full flex flex-col items-center z-10 pt-3 pb-6"
      >
        {/* Title Header - Never moves, always constant */}
        <div className="w-full flex flex-col items-center text-center px-4 shrink-0">
          <p className="eyebrow tracking-[0.2em] text-[color:var(--gold)] text-xs font-semibold">
            SIMPLE APPLICATION
          </p>
          <h2 className="mt-1 font-serif text-2xl sm:text-4xl font-normal text-foreground">
            Three simple steps
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Gentle, touch-free wound care engineered for rapid recovery and soothing comfort.
          </p>
        </div>

        {/* Card Deck Area - Cards stack in single slot below title */}
        <div className="relative w-full flex justify-center mt-3 h-[255px] sm:h-[285px]">
          {steps.map((stepData, i) => (
            <AnimatedStepCard
              key={stepData.step}
              i={i}
              {...stepData}
              progress={progress}
              total={steps.length}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

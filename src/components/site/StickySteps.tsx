import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import React, { useRef } from "react";
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
  }
];

const StickyCard = ({
  i,
  step,
  title,
  body,
  action,
  progress,
  range,
  targetScale,
}: {
  i: number;
  step: string;
  title: string;
  body: string;
  action: string;
  progress: MotionValue<number>;
  range: [number, number];
  targetScale: number;
}) => {
  const container = useRef<HTMLDivElement>(null);
  const scale = useTransform(progress, range, [1, targetScale]);

  return (
    <div ref={container} className="sticky top-[15vh] sm:top-[20vh] flex justify-center w-full pb-8 sm:pb-12">
      <motion.div
        style={{
          scale,
          top: `${i * 20}px`,
        }}
        className="relative flex w-[90%] max-w-[450px] origin-top flex-col overflow-hidden rounded-2xl sm:rounded-[2rem] border border-border bg-card p-8 sm:p-10 shadow-lg"
      >
        <span className="font-serif text-3xl sm:text-5xl font-normal text-[color:var(--gold)]">
          {step}
        </span>
        <h3 className="mt-4 font-serif text-2xl sm:text-3xl font-normal text-foreground">{title}</h3>
        <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
          {body}
        </p>
        <div className="mt-8 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[color:var(--botanical)]">
          <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5" />
          <span>{action}</span>
        </div>
      </motion.div>
    </div>
  );
};

export const StickySteps = () => {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  return (
    <section ref={container} className="relative w-full bg-[color:var(--surface)]">
      <div className="pt-16 sm:pt-24 pb-8 w-full flex flex-col items-center text-center px-4">
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

      <div className="w-full">
        {steps.map((stepData, i) => {
          const targetScale = Math.max(0.85, 1 - (steps.length - i - 1) * 0.05);
          return (
            <StickyCard
              key={i}
              i={i}
              {...stepData}
              progress={scrollYProgress}
              range={[i * 0.25, 1]}
              targetScale={targetScale}
            />
          );
        })}
      </div>
    </section>
  );
};

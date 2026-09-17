import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { CheckCircle2 } from "lucide-react";
import { SectionLabel } from "@/components/site/Section";

const CONDITION_ACTIONS: Record<string, string> = {
  "Diabetic Foot Ulcers": "Microcirculation Support",
  "Decubitus Ulcers (Bed Sores)": "Pressure Tissue Care",
  "Thermal Injuries (Fire Burns)": "Cooling & Soothing",
  "Accidental Trauma Wounds": "Antimicrobial Defense",
  "Post-Operative Surgical Wounds": "Incision Protection",
  "Chronic Non-Healing Wounds": "Phase Progression",
};

interface AnimatedIndicationProps {
  i: number;
  step: string;
  title: string;
  body: string;
  action: string;
  icon: any;
  progress: MotionValue<number>;
  total: number;
}

const AnimatedIndicationStepCard = ({
  i,
  step,
  title,
  body,
  action,
  icon: Icon,
  progress,
  total,
}: AnimatedIndicationProps) => {
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
        <span>{action}</span>
      </div>
    </motion.div>
  );
};

export function MobileStackedIndications({
  conditions,
}: {
  conditions: any[];
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
    <div
      ref={runwayRef}
      className="relative w-full sm:hidden bg-[color:var(--surface)]"
      style={{ height: runwayHeight }}
    >
      {/* Pinned Stage: Stays locked under navbar */}
      <div
        ref={stageRef}
        className="sticky top-[86px] sm:top-[96px] w-full flex flex-col items-center z-10 pt-3 pb-6"
      >
        {/* Constant Topic Header */}
        <div className="w-full flex flex-col items-center text-center px-4 shrink-0">
          <SectionLabel index="03" label="Clinical Indications" />
          <h2 className="mt-1 font-serif text-xl leading-tight text-foreground">
            Indications for Complex Wounds
          </h2>
          <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
            Formulated for complex wounds requiring disciplined ongoing care.
          </p>
        </div>

        {/* Card Deck Area - Cards stack in single slot below title */}
        <div className="relative w-full flex justify-center mt-3 h-[250px]">
          {conditions.map((item, i) => {
            const step = String(i + 1).padStart(2, "0");
            const action = CONDITION_ACTIONS[item.title] ?? "Clinical Care";
            const isComponent =
              typeof item.icon === "function" ||
              (typeof item.icon === "object" && item.icon !== null);
            const Icon = isComponent ? item.icon : CheckCircle2;

            return (
              <AnimatedIndicationStepCard
                key={item.title}
                i={i}
                step={step}
                title={item.title}
                body={item.body}
                action={action}
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

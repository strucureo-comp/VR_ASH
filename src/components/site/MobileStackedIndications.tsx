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

interface StickyIndicationCardProps {
  i: number;
  step: string;
  title: string;
  body: string;
  action: string;
  icon: any;
  progress: MotionValue<number>;
  range: [number, number];
  targetScale: number;
  total: number;
  baseTop: number;
  cardRef?: React.Ref<HTMLDivElement> | undefined;
  marginBottom?: string | undefined;
}

const StickyIndicationCard = ({
  i,
  step,
  title,
  body,
  action,
  icon: Icon,
  progress,
  range,
  targetScale,
  total,
  baseTop,
  cardRef,
  marginBottom,
}: StickyIndicationCardProps) => {
  const scale = useTransform(progress, range, [1, targetScale], { clamp: true });

  // Sticky slot for this card: base (just below the title block) + stagger.
  // 28px stagger: tight blank-edge peeks (top padding + hairline), numbers
  // tuck just underneath — the compact deck look.
  const stickyTop = baseTop + i * 28;

  return (
    <div
      className="sticky flex w-full justify-center px-4"
      style={{
        top: `${stickyTop}px`,
        zIndex: 10 + i,
        // CSS Bottom-Edge Equalization: Card 6 has 0 margin, Card 5 has 28px,
        // Card 4 has 56px, etc. This perfectly offsets their top stagger so
        // all 6 cards share the EXACT same physical bottom boundary.
        marginBottom: marginBottom ?? `${(total - 1 - i) * 28}px`,
      }}
    >
      <motion.div
        ref={cardRef}
        style={{ scale }}
        className="w-full max-w-[420px] origin-top flex flex-col rounded-2xl border border-border/80 bg-card p-5 shadow-[0_-4px_20px_rgba(0,0,0,0.06),0_10px_25px_rgba(0,0,0,0.08)] transition-colors min-h-[208px]"
      >
        <div className="flex items-center justify-between">
          <span className="font-serif text-2xl font-normal text-[color:var(--gold)]">{step}</span>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[color:var(--botanical)]/10 text-[color:var(--botanical)]">
            <Icon className="h-4 w-4" />
          </span>
        </div>

        <h3 className="mt-2.5 font-serif text-base font-semibold text-foreground">{title}</h3>

        <p className="mt-1 text-xs text-muted-foreground leading-relaxed flex-1">{body}</p>

        <div className="mt-3.5 flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-wider text-[color:var(--botanical)]">
          <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
          <span>{action}</span>
        </div>
      </motion.div>
    </div>
  );
};

export function MobileStackedIndications({ conditions }: { conditions: any[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const total = Math.max(1, conditions.length);

  const titleRef = useRef<HTMLDivElement>(null);
  const lastCardRef = useRef<HTMLDivElement>(null);
  const [baseTop, setBaseTop] = useState(208);
  const [tail, setTail] = useState(28);
  // Equalized bottom margin for the Title to match Card 6's bottom edge:
  // (baseTop + 140 + cardH) - (84 + titleH)
  const [titleMarginBottom, setTitleMarginBottom] = useState(345);

  useEffect(() => {
    // Single measurement pass (plus guards for late resources/resizes).
    const measure = () => {
      const titleH = titleRef.current?.offsetHeight || 119;
      const cardH = lastCardRef.current?.offsetHeight || 200;
      const base = Math.round(84 + titleH + 5);
      const nextTail = 28; // flat 28px tail
      setBaseTop(base);
      setTail(nextTail);

      // Title Bottom-Edge Equalization:
      // (baseTop + 140 + cardHeight) - (84 + titleHeight)
      const titleMB = Math.max(0, base + 140 + cardH - (84 + titleH));
      setTitleMarginBottom(titleMB);

      // Clean up --deck-tail-pull since tail is already 28px
      document.documentElement.style.removeProperty("--deck-tail-pull");
    };
    measure();
    if (document.fonts) {
      document.fonts.ready.then(measure).catch(() => undefined);
    }
    window.addEventListener("resize", measure);
    window.addEventListener("orientationchange", measure);
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("orientationchange", measure);
      document.documentElement.style.removeProperty("--deck-tail-pull");
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full sm:hidden bg-[color:var(--surface)] pt-2"
      style={{ paddingBottom: tail }}
      data-base-top={baseTop}
      data-tail={tail}
    >
      {/* Sticky Section Title Header - Equalized bottom edge matches Card 6 */}
      <div
        ref={titleRef}
        className="sticky top-[84px] z-20 bg-[color:var(--surface)] pt-3 pb-3 px-4 text-center min-h-[150px]"
        style={{ marginBottom: `${titleMarginBottom}px` }}
      >
        <div className="flex justify-center">
          <SectionLabel index="03" label="Clinical Indications" />
        </div>
        <h2 className="mt-1 font-serif text-2xl leading-tight text-foreground">
          Indications for Complex Wounds
        </h2>
        <p className="mt-1 text-xs text-muted-foreground leading-relaxed max-w-sm mx-auto">
          Formulated for complex wounds requiring disciplined ongoing care.
        </p>
      </div>

      {/* Sticky Card Deck Stream - Each card's marginBottom equalizes physical bottom boundary */}
      <div className="relative w-full mt-3">
        {conditions.map((item, i) => {
          const step = String(i + 1).padStart(2, "0");
          const action = CONDITION_ACTIONS[item.title] ?? "Clinical Care";
          const isComponent =
            typeof item.icon === "function" ||
            (typeof item.icon === "object" && item.icon !== null);
          const Icon = isComponent ? item.icon : CheckCircle2;

          const targetScale = Math.max(0.88, 1 - (total - i - 1) * 0.025);
          const range: [number, number] = [total > 1 ? i / total : 0, 1];

          return (
            <StickyIndicationCard
              key={item.title || i}
              i={i}
              step={step}
              title={item.title}
              body={item.body}
              action={action}
              icon={Icon}
              progress={scrollYProgress}
              range={range}
              targetScale={targetScale}
              total={total}
              baseTop={baseTop}
              cardRef={i === total - 1 ? lastCardRef : undefined}
              marginBottom={`${(total - 1 - i) * 28}px`}
            />
          );
        })}
      </div>
    </section>
  );
}

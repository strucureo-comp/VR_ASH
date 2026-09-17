import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { CheckCircle2 } from "lucide-react";

export function MobileStackedIndications({ conditions }: { conditions: any[] }) {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  return (
    <div
      ref={container}
      className="relative flex w-full flex-col sm:hidden"
    >
      <div className="flex flex-col gap-0 pb-[5vh]">
        {conditions.map((item, i) => {
          const targetScale = Math.max(0.85, 1 - (conditions.length - i - 1) * 0.05);
          return (
            <StickyIndicationCard
              key={item.title}
              item={item}
              i={i}
              progress={scrollYProgress}
              range={[i * (1 / conditions.length), 1]}
              targetScale={targetScale}
            />
          );
        })}
      </div>
    </div>
  );
}

function StickyIndicationCard({ item, i, progress, range, targetScale }: any) {
  const scale = useTransform(progress, range, [1, targetScale]);
  // Compress the stack gap (was i * 14) so 6 cards don't look messy at the top
  const topOffset = i * 6;
  const isComponent = typeof item.icon === 'function' || (typeof item.icon === 'object' && item.icon !== null);
  const Icon = isComponent ? item.icon : CheckCircle2;

  return (
    // Increased from top-[140px] to top-[30vh] to clear the intro text before sticking
    <div className="sticky top-[30vh] flex w-full flex-col mb-0">
      <motion.div
        style={{
          scale,
          top: `${topOffset}px`,
        }}
        className="relative origin-top flex h-[190px] w-full flex-col rounded-2xl border border-border bg-card p-5 shadow-xl transition-colors hover:border-[color:var(--botanical)]/40"
      >
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[color:var(--botanical)]/10 text-[color:var(--botanical)]">
            <Icon className="h-5 w-5" />
          </span>
          <h3 className="font-serif text-base font-semibold text-foreground">{item.title}</h3>
        </div>
        <p className="mt-2.5 flex-1 text-xs leading-relaxed text-muted-foreground">
          {item.body}
        </p>
      </motion.div>
    </div>
  );
}

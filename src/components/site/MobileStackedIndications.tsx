import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { CheckCircle2 } from "lucide-react";

export function MobileStackedIndications({ 
  conditions,
  topOffsetPx = 140 
}: { 
  conditions: any[],
  topOffsetPx?: number 
}) {
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
      <div className="flex flex-col gap-0 pb-10">
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
              topOffsetPx={topOffsetPx}
            />
          );
        })}
      </div>
    </div>
  );
}

function StickyIndicationCard({ item, i, progress, range, targetScale, topOffsetPx }: any) {
  const scale = useTransform(progress, range, [1, targetScale]);
  const topOffset = i * 10;
  const isComponent = typeof item.icon === 'function' || (typeof item.icon === 'object' && item.icon !== null);
  const Icon = isComponent ? item.icon : CheckCircle2;

  return (
    <div 
      className="sticky flex w-full flex-col mb-0"
      style={{ top: `${topOffsetPx}px` }}
    >
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

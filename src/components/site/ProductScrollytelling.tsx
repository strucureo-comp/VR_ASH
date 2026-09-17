import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
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

export function MobileScrollytelling({
  bottleSrc,
  bottleAlt,
  howItHelpsTitle = "Four actions,<br />one spray.",
  benefits = [],
  whereToApplyTitle = "Made for everyday<br />wounds",
  conditions = [],
}: ProductScrollytellingProps) {
  const runwayRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: runwayRef,
    offset: ["start start", "end end"],
  });

  const bottleX = useTransform(
    scrollYProgress,
    [0, 0.2, 0.4, 0.6, 0.8, 1],
    ["-28vw", "-28vw", "28vw", "28vw", "0vw", "0vw"]
  );

  const bottleRotate = useTransform(
    scrollYProgress,
    [0, 0.2, 0.4, 0.6, 0.8, 1],
    [-4, -4, 4, 4, 0, 0]
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
    [15, 0, 0, -15],
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
    [15, 0, 0, -15],
    { clamp: true }
  );

  return (
    <div ref={runwayRef} className="relative h-[200vh]">
      <div className="sticky top-[10svh] h-[80svh] w-full overflow-hidden flex items-center justify-center">
        
        <div className="relative mx-auto flex h-full w-full max-w-sm items-center justify-center px-4">
          
          {/* PHASE 1: HOW IT HELPS */}
          <motion.div
            id="actions-mobile"
            style={{ opacity: stage1Opacity, y: stage1Y }}
            className="pointer-events-none absolute z-20 w-[60%] right-4 top-1/2 -translate-y-[45%]"
          >
            <div className="rounded-2xl border border-border/70 bg-card/95 p-4 sm:p-5 shadow-md backdrop-blur-sm pointer-events-auto">
              <p className="eyebrow tracking-[0.18em] text-[color:var(--gold)] text-[10.5px] font-bold">PHYSIOLOGICAL MECHANISM</p>
              <h2 className="mt-1 font-serif text-lg sm:text-xl font-normal leading-tight text-foreground" dangerouslySetInnerHTML={{ __html: howItHelpsTitle }} />
              
              <ul className="mt-3 space-y-2.5">
                {benefits.slice(0, 4).map((b, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[color:var(--botanical)]/15 text-[color:var(--botanical)]">
                      <CheckCircle2 className="h-2.5 w-2.5" />
                    </span>
                    <div>
                      <h3 className="font-semibold text-foreground text-[11px] leading-tight">{b.title}</h3>
                      <p className="mt-0.5 text-[9.5px] text-muted-foreground/90 leading-[1.35] line-clamp-2">
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
            className="pointer-events-none absolute z-20 w-[60%] left-4 top-1/2 -translate-y-[45%]"
          >
            <div className="rounded-2xl border border-border/70 bg-card/95 p-4 sm:p-5 shadow-md backdrop-blur-sm pointer-events-auto">
              <p className="eyebrow tracking-[0.18em] text-[color:var(--gold)] text-[10.5px] font-bold">CLINICAL INDICATIONS</p>
              <h2 className="mt-1 font-serif text-lg sm:text-xl font-normal leading-tight text-foreground" dangerouslySetInnerHTML={{ __html: whereToApplyTitle }} />

              <div className="mt-3 space-y-2.5">
                {conditions.slice(0, 3).map((c, i) => {
                  const Icon = resolveIcon(c.icon ?? "");
                  return (
                    <div key={i} className="rounded-xl border border-border/60 bg-background/50 p-2.5">
                      <div className="flex items-center gap-2">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-[color:var(--botanical)]/10 text-[color:var(--botanical)]">
                          <Icon className="h-3 w-3" />
                        </span>
                        <h3 className="font-semibold text-foreground text-[11px] leading-tight">
                          {c.title}
                        </h3>
                      </div>
                      <p className="mt-1.5 text-[9.5px] text-muted-foreground/90 leading-[1.35] line-clamp-2">
                        {c.body}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* BOTTLE */}
          <motion.div
            style={{ x: bottleX, y: "0px", rotate: bottleRotate }}
            className="pointer-events-none relative z-10 flex flex-col items-center justify-center will-change-transform mt-[5vh]"
          >
            <img src={bottleSrc} alt={bottleAlt} width={500} height={700} className="max-h-[42vh] w-auto object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.12)]" />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";

/**
 * The phone-only top of a product page: the product image is pinned under the
 * sticky header while the panel beneath it advances from the product's name to
 * its sizes, price and Add to cart, and the image turns from its front pose to
 * its back one.
 *
 * It exists because a phone has one column. On a tablet or a laptop the image
 * and the buying controls sit side by side and everything is visible at once, so
 * those layouts are left alone — this whole component is `sm:hidden` and the
 * pages that use it keep their existing markup from `sm:` upward.
 *
 * Both text phases stay in the DOM; only opacity and pointer-events move, so the
 * buy controls keep their own focus order. With `prefers-reduced-motion` the
 * scroll runway is dropped altogether and the phases render as one plain stack.
 */

/** The point in the runway past which the buy controls, not the name, are live. */
const ADVANCE_AT = 0.46;

export type StageImage = { src: string; alt: string };

type Props = {
  className?: string;
  /** First is the front pose, second (optional) the back. Extras are ignored. */
  images: StageImage[];
  /** Stands in for a product with no image at all. */
  fallbackLetter?: string;
  eyebrow?: string;
  /** A node, not a string, because `Soliderma&trade;` is markup. */
  title: ReactNode;
  subtitle?: string | null;
  price?: string | null;
  sizes?: string[];
  /** The buy controls, revealed by the second phase. */
  children?: ReactNode;
};

export function MobileBuyStage({
  className = "",
  images,
  fallbackLetter,
  eyebrow = "Product",
  title,
  subtitle,
  price,
  sizes = [],
  children,
}: Props) {
  const runwayRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const [advanced, setAdvanced] = useState(false);

  const { scrollYProgress } = useScroll({
    target: runwayRef,
    offset: ["start start", "end end"],
  });
  const p = useSpring(scrollYProgress, { stiffness: 80, damping: 24, mass: 0.7 });

  const frontOpacity = useTransform(p, [0.3, 0.55], [1, 0]);
  const frontRotate = useTransform(p, [0.3, 0.55], [0, -35]);
  const backOpacity = useTransform(p, [0.45, 0.7], [0, 1]);
  const backRotate = useTransform(p, [0.45, 0.7], [35, 0]);
  const nameOpacity = useTransform(p, [0.18, 0.36], [1, 0]);
  const nameShift = useTransform(p, [0.18, 0.36], [0, -18]);
  const buyOpacity = useTransform(p, [0.38, 0.56], [0, 1]);
  const buyShift = useTransform(p, [0.38, 0.56], [20, 0]);
  const cueOpacity = useTransform(p, [0, 0.14], [1, 0]);

  // A threshold crossing, not every frame: this re-renders twice per page view,
  // and only so that a faded-out phase cannot swallow a tap.
  useMotionValueEvent(p, "change", (v) => {
    const next = v > ADVANCE_AT;
    setAdvanced((current) => (current === next ? current : next));
  });

  const front = images[0] ?? null;
  const back = images[1] ?? null;

  // `inset-6`/`max-h-[calc(100%-3rem)]` rather than `inset-0`: an absolutely
  // positioned child is laid out against the padding box, so it would otherwise
  // sit right against the card's rounded border.
  const imageClass =
    "absolute inset-6 m-auto max-h-[calc(100%-3rem)] w-auto object-contain drop-shadow-xl will-change-transform [backface-visibility:hidden]";

  const name = (
    <>
      <p className="eyebrow text-[color:var(--gold)]">{eyebrow}</p>
      <h1 className="mt-3 text-[2rem] leading-tight text-foreground">{title}</h1>
      {subtitle ? (
        <p className="mt-2 font-display text-lg text-[color:var(--burgundy)]">{subtitle}</p>
      ) : null}
      {price ? <p className="mt-3 font-display text-xl text-foreground">{price}</p> : null}
    </>
  );

  const buy = (
    <>
      {sizes.length > 0 ? (
        <p className="eyebrow text-muted-foreground">{sizes.join(" · ")}</p>
      ) : null}
      {price ? <p className="mt-2 font-display text-2xl text-foreground">{price}</p> : null}
      {children ? <div className="mt-4">{children}</div> : null}
    </>
  );

  const fallback = (
    <span className="absolute inset-0 flex items-center justify-center font-display text-5xl text-muted-foreground">
      {fallbackLetter}
    </span>
  );

  if (reduceMotion) {
    return (
      <div className={className}>
        <div className="relative flex h-72 items-center justify-center rounded-xl border border-border bg-[color:var(--ivory)] p-6">
          {front ? <img src={front.src} alt={front.alt} className={imageClass} /> : fallback}
        </div>
        <div className="mt-6">{name}</div>
        <div className="mt-8">{buy}</div>
      </div>
    );
  }

  return (
    <div ref={runwayRef} className={`relative h-[185vh] ${className}`}>
      {/* `top-24` clears the sticky header — the announcement strip plus the nav
          row measure ~96px on a phone. `svh` rather than `vh` so the panel never
          hides its own Add to cart under a mobile browser's bottom toolbar. */}
      <div className="sticky top-24 flex h-[calc(100svh-6rem)] flex-col">
        <div className="relative min-h-0 flex-1 rounded-xl border border-border bg-[color:var(--ivory)] p-6 [perspective:1200px]">
          <div className="absolute inset-x-10 bottom-[14%] h-8 rounded-full bg-[color:var(--botanical)]/20 blur-2xl" />
          {front ? (
            <>
              <motion.img
                src={front.src}
                alt={front.alt}
                style={{ opacity: frontOpacity, rotateY: frontRotate }}
                className={imageClass}
              />
              {back ? (
                <motion.img
                  src={back.src}
                  alt={back.alt}
                  loading="lazy"
                  style={{ opacity: backOpacity, rotateY: backRotate }}
                  className={imageClass}
                />
              ) : null}
            </>
          ) : (
            fallback
          )}
        </div>

        <div className="relative h-64 shrink-0">
          {/* Not `aria-hidden` even when faded: this holds the page's only `h1` on
              a phone, and a screen reader should still find it by heading. */}
          <motion.div
            style={{ opacity: nameOpacity, y: nameShift }}
            className={`absolute inset-x-0 top-6 ${advanced ? "pointer-events-none" : ""}`}
          >
            {name}
            <motion.span
              style={{ opacity: cueOpacity }}
              className="mt-5 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-muted-foreground"
            >
              Scroll
              <motion.span
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                className="inline-flex"
              >
                <ChevronDown className="h-4 w-4" />
              </motion.span>
            </motion.span>
          </motion.div>

          {/* `inert` rather than `aria-hidden`: it also takes the Add to cart
              button out of the focus order while it is invisible. Reading the
              page with a screen reader scrolls it, which flips `advanced`. */}
          <motion.div
            inert={!advanced}
            style={{ opacity: buyOpacity, y: buyShift }}
            className={`absolute inset-x-0 top-6 ${advanced ? "" : "pointer-events-none"}`}
          >
            {buy}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

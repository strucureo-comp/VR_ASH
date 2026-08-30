import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Leaf } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";

import { AddToCart } from "@/components/site/AddToCart";
import { Blob } from "@/components/site/Blob";
import { Reveal } from "@/components/site/Reveal";
import { imageAlt, priceRangeLabel, productSubtitle, sizedImage } from "@/lib/shopify/format";
import type { Product } from "@/lib/shopify/types";

/**
 * The "Our Range" cards, laid out for however many products Shopify returns.
 *
 * One or two products now centre instead of sitting in the left third of a
 * three-column grid, which is what the fixed grid did for as long as the store had
 * a single product. Past three, the row becomes a horizontal rail that advances on
 * its own, so the section keeps its height as the catalogue grows rather than
 * stacking into a wall of cards.
 */

/** Three still fit one laptop row; the fourth is what turns the grid into a rail. */
const RAIL_FROM = 4;
const STEP_MS = 3800;
/** How long a touch or an arrow press holds the auto-advance off. */
const HOLD_MS = 6000;

export function ProductRange({ products }: { products: readonly Product[] }) {
  if (products.length === 0) return null;
  if (products.length < RAIL_FROM) return <Grid products={products} />;
  return <Rail products={products} />;
}

function Grid({ products }: { products: readonly Product[] }) {
  // A lone card gets a wider column of its own: half a row is too narrow to read
  // as the whole range, and a third of one looks like a layout bug.
  const width = products.length === 1 ? "sm:w-[23rem]" : "sm:w-[calc(50%-0.75rem)] lg:w-[21rem]";

  return (
    <div className="mt-8 flex flex-wrap justify-center gap-5 sm:mt-12 sm:gap-6">
      {products.map((product, index) => (
        <Reveal key={product.handle} delay={index * 0.06} className={`w-full ${width}`}>
          <ProductCard product={product} />
        </Reveal>
      ))}
    </div>
  );
}

function Rail({ products }: { products: readonly Product[] }) {
  const rail = useRef<HTMLDivElement | null>(null);
  const resume = useRef<number | null>(null);
  const [paused, setPaused] = useState(false);

  // Hover, focus and touch all stop the advance: a strip that moves while it is
  // being read is a nuisance, and it must never fight a finger mid-swipe. Anyone
  // who has asked their system for less motion gets none of it.
  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const id = window.setInterval(() => scrollByCard(1), STEP_MS);
    return () => window.clearInterval(id);
  }, [paused]);

  useEffect(
    () => () => {
      if (resume.current !== null) window.clearTimeout(resume.current);
    },
    [],
  );

  function scrollByCard(direction: 1 | -1) {
    const node = rail.current;
    if (!node) return;

    const cards = Array.from(node.children);
    const [first, second] = cards;
    // Measured, not assumed: the card width and the gap both change at `sm`.
    const stride =
      first instanceof HTMLElement && second instanceof HTMLElement
        ? second.offsetLeft - first.offsetLeft
        : node.clientWidth;

    const end = node.scrollWidth - node.clientWidth;
    const next = node.scrollLeft + direction * stride;
    // Wraps at both ends, so neither the timer nor an arrow ever dead-ends.
    node.scrollTo({ left: next > end - 1 ? 0 : next < 0 ? end : next, behavior: "smooth" });
  }

  function hold() {
    setPaused(true);
    if (resume.current !== null) window.clearTimeout(resume.current);
    resume.current = window.setTimeout(() => setPaused(false), HOLD_MS);
  }

  return (
    <Reveal className="mt-8 sm:mt-12">
      {/* The scrollbar is hidden because the arrows and the peeking next card are
          the affordance; swipe and keyboard scrolling both still work. */}
      <div
        ref={rail}
        role="region"
        aria-label="Products"
        tabIndex={0}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
        onTouchStart={hold}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-1 [scrollbar-width:none] sm:gap-6 [&::-webkit-scrollbar]:hidden"
      >
        {products.map((product) => (
          <div key={product.handle} className="w-[85%] shrink-0 snap-start sm:w-[20rem]">
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-center gap-3">
        <Arrow
          label="Previous product"
          onClick={() => {
            hold();
            scrollByCard(-1);
          }}
        >
          <ChevronLeft className="h-4 w-4" />
        </Arrow>
        <Arrow
          label="Next product"
          onClick={() => {
            hold();
            scrollByCard(1);
          }}
        >
          <ChevronRight className="h-4 w-4" />
        </Arrow>
      </div>
    </Reveal>
  );
}

function Arrow({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors sm:hover:border-[color:var(--gold)] sm:hover:text-primary"
    >
      {children}
    </button>
  );
}

/**
 * Lifted out of `index.tsx` so the grid and the rail cannot drift apart.
 *
 * The image and the copy are one link to the product; the price and the buy button
 * sit outside it, because a `<button>` inside an `<a>` is invalid and swallows the
 * click that was meant for the cart. Every product links through `/products/$slug`
 * as the rest of the site does — Soliderma's page redirects there — rather than this
 * component knowing which product has a route of its own.
 */
function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-colors sm:hover:border-[color:var(--gold)]">
      <Link to="/products/$slug" params={{ slug: product.handle }} className="flex flex-1 flex-col">
        <div className="relative isolate flex h-36 items-center justify-center overflow-hidden bg-[color:var(--ivory)] sm:h-44">
          <Blob
            variant={3}
            className="-bottom-16 left-1/2 h-48 w-64 -translate-x-1/2 -z-10"
            color="var(--botanical)"
            opacity={0.16}
          />
          {product.featuredImage ? (
            <img
              src={sizedImage(product.featuredImage.url, 600)}
              alt={imageAlt(product.featuredImage.altText, product)}
              loading="lazy"
              className="h-32 w-auto object-contain drop-shadow-[0_14px_26px_rgba(0,0,0,0.16)] transition-transform duration-500 sm:h-40 sm:group-hover:scale-105"
            />
          ) : (
            <Leaf className="h-9 w-9 text-[color:var(--botanical)]/40" />
          )}
        </div>
        <div className="flex flex-1 flex-col px-5 pt-5 sm:px-6 sm:pt-6">
          <h3 className="text-xl text-foreground transition-colors sm:group-hover:text-[color:var(--burgundy)]">
            {product.title}
          </h3>
          <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-[color:var(--gold)]">
            {productSubtitle(product)}
          </p>
          <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
            {product.description}
          </p>
        </div>
      </Link>
      <div className="px-5 pb-5 sm:px-6 sm:pb-6">
        <div className="mt-5 border-t border-border pt-4">
          <p className="font-display text-xl text-foreground">{priceRangeLabel(product)}</p>
        </div>
        <div className="mt-4">
          <AddToCart product={product} compact />
        </div>
      </div>
    </article>
  );
}

import bottle from "@/assets/soliderma-bottle.png";

export type ProductVariant = {
  size: string;
  note: string;
  /** Selling price in INR. `null` until a price is published — the UI then shows "Price on request". */
  price: number | null;
};

export type Product = {
  slug: string;
  name: string;
  subtitle: string;
  blurb: string;
  image: string | null;
  variants: ProductVariant[];
  available: boolean;
  /** Shown in the home-page featured row (the rest appear as upcoming cards / on /products). */
  featured: boolean;
};

/**
 * Catalogue. Add new products here — the home page grid, product pages and the
 * cart all read from this single list, so 3–4 more entries need no layout work.
 *
 * TODO: set real `price` values. Anything left as `null` renders as
 * "Price on request" rather than a made-up number.
 */
export const PRODUCTS: Product[] = [
  {
    slug: "soliderma",
    name: "Soliderma™",
    subtitle: "Multi Action Wound Healing Spray",
    blurb:
      "A herbal wound-care spray built on an Ayurvedic proprietary formulation, in a convenient spray format.",
    image: bottle,
    variants: [
      { size: "100 ml", note: "Convenient format for regular use.", price: null },
      { size: "50 ml", note: "Compact format for convenient handling.", price: null },
    ],
    available: true,
    featured: true,
  },
  {
    slug: "pain-relief-spray",
    name: "Pain Relief Spray",
    subtitle: "Coming Soon",
    blurb: "A herbal spray in development for soreness and discomfort around the area under care.",
    image: null,
    variants: [{ size: "100 ml", note: "Planned launch size.", price: null }],
    available: false,
    featured: true,
  },
  {
    slug: "multi-care-spray",
    name: "Multi-Care Spray",
    subtitle: "Coming Soon",
    blurb: "An everyday herbal spray planned for minor cuts, abrasions and general skin care.",
    image: null,
    variants: [{ size: "100 ml", note: "Planned launch size.", price: null }],
    available: false,
    featured: true,
  },
  {
    slug: "herbal-wound-oil",
    name: "Herbal Wound Oil",
    subtitle: "Coming Soon",
    blurb: "An Ayurvedic oil preparation planned as a companion to the Soliderma routine.",
    image: null,
    variants: [{ size: "100 ml", note: "Planned launch size.", price: null }],
    available: false,
    featured: false,
  },
  {
    slug: "herbal-cleansing-wash",
    name: "Herbal Cleansing Wash",
    subtitle: "Coming Soon",
    blurb: "A gentle herbal wash intended for preparing the affected area before application.",
    image: null,
    variants: [{ size: "200 ml", note: "Planned launch size.", price: null }],
    available: false,
    featured: false,
  },
  {
    slug: "herbal-care-balm",
    name: "Herbal Care Balm",
    subtitle: "Coming Soon",
    blurb: "A balm format under development for continued care after the healing phase.",
    image: null,
    variants: [{ size: "50 g", note: "Planned launch size.", price: null }],
    available: false,
    featured: false,
  },
];

export function getProduct(slug: string) {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function formatINR(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Lowest published price across variants, or `null` when none are priced yet. */
export function priceFrom(product: Product) {
  const prices = product.variants
    .map((v) => v.price)
    .filter((p): p is number => typeof p === "number");
  return prices.length ? Math.min(...prices) : null;
}

/**
 * The single place that decides how a price is worded, so the home page,
 * /products, the product detail page and /soliderma always agree.
 */
export function priceLabel(product: Product) {
  const from = priceFrom(product);
  return from === null ? "Price on request" : formatINR(from);
}

export function variantPriceLabel(variant: ProductVariant) {
  return variant.price === null ? "Price on request" : formatINR(variant.price);
}

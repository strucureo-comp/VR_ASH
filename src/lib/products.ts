import bottle from "@/assets/soliderma-bottle.png";

export type ProductVariant = {
  size: string;
  note: string;
};

export type Product = {
  slug: string;
  name: string;
  subtitle: string;
  blurb: string;
  image: string | null;
  variants: ProductVariant[];
  available: boolean;
};

/**
 * Catalogue. Add new products here — the home page grid, product pages and the
 * cart all read from this single list, so 3–4 more entries need no layout work.
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
      { size: "100 ml", note: "Convenient format for regular use." },
      { size: "50 ml", note: "Compact format for convenient handling." },
    ],
    available: true,
  },
  {
    slug: "herbal-wound-oil",
    name: "Herbal Wound Oil",
    subtitle: "Coming Soon",
    blurb: "An Ayurvedic oil preparation planned as a companion to the Soliderma routine.",
    image: null,
    variants: [{ size: "100 ml", note: "Planned launch size." }],
    available: false,
  },
  {
    slug: "herbal-cleansing-wash",
    name: "Herbal Cleansing Wash",
    subtitle: "Coming Soon",
    blurb: "A gentle herbal wash intended for preparing the affected area before application.",
    image: null,
    variants: [{ size: "200 ml", note: "Planned launch size." }],
    available: false,
  },
  {
    slug: "herbal-care-balm",
    name: "Herbal Care Balm",
    subtitle: "Coming Soon",
    blurb: "A balm format under development for continued care after the healing phase.",
    image: null,
    variants: [{ size: "50 g", note: "Planned launch size." }],
    available: false,
  },
];

export function getProduct(slug: string) {
  return PRODUCTS.find((p) => p.slug === slug);
}

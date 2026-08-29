import type {
  Cart,
  CartLine,
  CartResult,
  CartUserError,
  Money,
  Product,
  ProductImage,
  ProductVariant,
} from "./types";

/* ---------- raw Storefront shapes (only the fields the documents request) ---------- */

type RawMoney = { amount: string; currencyCode: string };
type RawImage = {
  url: string;
  altText: string | null;
  width: number | null;
  height: number | null;
};

type RawVariant = {
  id: string;
  title: string;
  sku: string | null;
  availableForSale: boolean;
  quantityAvailable: number | null;
  price: RawMoney;
  compareAtPrice: RawMoney | null;
  image: RawImage | null;
  selectedOptions: Array<{ name: string; value: string }>;
};

export type RawProduct = {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  vendor: string;
  productType: string;
  tags: string[];
  availableForSale: boolean;
  totalInventory: number | null;
  seo: { title: string | null; description: string | null };
  featuredImage: RawImage | null;
  images: { nodes: RawImage[] };
  variants: { nodes: RawVariant[] };
  priceRange: { minVariantPrice: RawMoney; maxVariantPrice: RawMoney };
};

type RawCartLine = {
  id: string;
  quantity: number;
  cost: { totalAmount: RawMoney; amountPerQuantity: RawMoney };
  merchandise: {
    id?: string;
    title?: string;
    availableForSale?: boolean;
    quantityAvailable?: number | null;
    image?: RawImage | null;
    price?: RawMoney;
    product?: { handle: string; title: string };
  };
};

export type RawCart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    subtotalAmount: RawMoney;
    totalAmount: RawMoney;
    totalTaxAmount: RawMoney | null;
  };
  lines: { nodes: RawCartLine[] };
};

export type RawCartMutation = {
  cart: RawCart | null;
  userErrors: Array<{ field: string[] | null; message: string; code: string | null }>;
};

/* ---------- mappers ---------- */

const ZERO: Money = { amount: 0, currencyCode: "INR" };

function money(raw: RawMoney | null | undefined): Money | null {
  if (!raw) return null;
  const amount = Number(raw.amount);
  return { amount: Number.isFinite(amount) ? amount : 0, currencyCode: raw.currencyCode };
}

function requiredMoney(raw: RawMoney | null | undefined): Money {
  return money(raw) ?? ZERO;
}

function image(raw: RawImage | null | undefined): ProductImage | null {
  if (!raw) return null;
  return { url: raw.url, altText: raw.altText, width: raw.width, height: raw.height };
}

function variant(raw: RawVariant): ProductVariant {
  return {
    id: raw.id,
    title: raw.title,
    sku: raw.sku,
    price: requiredMoney(raw.price),
    compareAtPrice: money(raw.compareAtPrice),
    availableForSale: raw.availableForSale,
    quantityAvailable: raw.quantityAvailable ?? null,
    image: image(raw.image),
    selectedOptions: raw.selectedOptions,
  };
}

export function toProduct(raw: RawProduct): Product {
  return {
    id: raw.id,
    handle: raw.handle,
    title: raw.title,
    description: raw.description,
    descriptionHtml: raw.descriptionHtml,
    vendor: raw.vendor,
    productType: raw.productType,
    tags: raw.tags,
    featuredImage: image(raw.featuredImage),
    images: raw.images.nodes.map((i) => image(i)).filter((i): i is ProductImage => i !== null),
    variants: raw.variants.nodes.map(variant),
    priceRange: {
      min: requiredMoney(raw.priceRange.minVariantPrice),
      max: requiredMoney(raw.priceRange.maxVariantPrice),
    },
    availableForSale: raw.availableForSale,
    totalInventory: raw.totalInventory ?? null,
    seoTitle: raw.seo.title,
    seoDescription: raw.seo.description,
  };
}

function cartLine(raw: RawCartLine): CartLine {
  const m = raw.merchandise;
  return {
    id: raw.id,
    quantity: raw.quantity,
    merchandiseId: m.id ?? "",
    productHandle: m.product?.handle ?? "",
    productTitle: m.product?.title ?? "",
    variantTitle: m.title ?? "",
    image: image(m.image),
    unitPrice: requiredMoney(raw.cost.amountPerQuantity),
    lineTotal: requiredMoney(raw.cost.totalAmount),
    availableForSale: m.availableForSale ?? true,
    quantityAvailable: m.quantityAvailable ?? null,
  };
}

export function toCart(raw: RawCart): Cart {
  return {
    id: raw.id,
    checkoutUrl: raw.checkoutUrl,
    totalQuantity: raw.totalQuantity,
    subtotal: requiredMoney(raw.cost.subtotalAmount),
    total: requiredMoney(raw.cost.totalAmount),
    tax: money(raw.cost.totalTaxAmount),
    lines: raw.lines.nodes.map(cartLine),
  };
}

export function toCartResult(raw: RawCartMutation | null | undefined): CartResult {
  const userErrors: CartUserError[] = (raw?.userErrors ?? []).map((e) => ({
    field: e.field ?? null,
    message: e.message,
    code: e.code ?? null,
  }));
  return { cart: raw?.cart ? toCart(raw.cart) : null, userErrors };
}

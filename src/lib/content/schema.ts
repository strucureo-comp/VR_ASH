import { z } from "zod";

/**
 * The one description of what the Realtime Database holds. The admin editor
 * validates writes against these schemas and the storefront validates reads
 * against them, so a node edited by hand in the Firebase console cannot put a
 * shape the pages do not expect in front of a visitor.
 *
 * Two flavours on purpose: the `*FormSchema` exports are strict and have no
 * transforms, so react-hook-form's value type and the parsed result are the same
 * type; the read schemas are lenient, because they parse whatever is already in
 * the database and must not throw a page away over one malformed row.
 *
 * zod is v3 here, not v4.
 */

const text = (max: number) => z.string().trim().min(1).max(max);
const looseText = (max: number) => z.string().trim().max(max);

/** Read-side text: missing, null and empty all normalise to "". */
const readText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .nullish()
    .transform((v) => v ?? "");

const readNumber = z
  .number()
  .nullish()
  .transform((v) => v ?? 0);

const readBoolean = z
  .boolean()
  .nullish()
  .transform((v) => v ?? false);

/**
 * The Realtime Database returns a list written as an array as a JSON array, but
 * a list with a gap in its keys as an object keyed by index — and it omits an
 * empty list entirely. This normalises all three, then drops any single entry
 * that fails to parse rather than losing the whole list to one bad row.
 */
export const listOf = <T extends z.ZodTypeAny>(item: T) =>
  z.preprocess(
    (raw) => {
      if (raw == null) return [];
      if (Array.isArray(raw)) return raw.filter((v) => v != null);
      if (typeof raw === "object") return Object.values(raw as Record<string, unknown>);
      return [];
    },
    z
      .array(item.nullable().catch(null))
      .transform((items) => items.filter((v): v is z.output<T> => v != null)),
  );

/** A lucide icon name resolved through `icons.ts`; an unknown name falls back. */
const iconName = looseText(40);

export const benefitSchema = z.object({ title: text(120), body: text(600) });
export const ingredientSchema = z.object({
  name: text(120),
  latin: looseText(160),
  part: looseText(80),
});
export const stepSchema = z.object({ step: text(8), title: text(120), body: text(600) });
export const conditionSchema = z.object({ icon: iconName, title: text(120), body: text(600) });
export const faqSchema = z.object({ q: text(300), a: text(2000) });

/** What the product editor submits. Every field is present, no transforms. */
export const productContentFormSchema = z.object({
  longDescription: looseText(8000),
  directions: looseText(2000),
  caution: looseText(2000),
  benefits: z.array(benefitSchema),
  ingredients: z.array(ingredientSchema),
  steps: z.array(stepSchema),
  conditions: z.array(conditionSchema),
  faqs: z.array(faqSchema),
});

/** What the shared-content editor submits. */
export const sharedContentFormSchema = z.object({
  certifications: z.array(conditionSchema),
  faqs: z.array(faqSchema),
});

/** Everything the site says about one Shopify product, as read back. */
export const productContentSchema = z.object({
  updatedAt: readNumber,
  longDescription: readText(8000),
  directions: readText(2000),
  caution: readText(2000),
  benefits: listOf(benefitSchema),
  ingredients: listOf(ingredientSchema),
  steps: listOf(stepSchema),
  conditions: listOf(conditionSchema),
  faqs: listOf(faqSchema),
});

/** Blocks several brand pages render, so they live once rather than per product. */
export const sharedContentSchema = z.object({
  updatedAt: readNumber,
  certifications: listOf(conditionSchema),
  faqs: listOf(faqSchema),
});

/**
 * Which products already have a content record, from a `?shallow=true` read.
 *
 * Shallow means the database sends keys with `true` in place of each subtree, so
 * the admin product list can say "content saved" without downloading every
 * product's copy to find out.
 */
export const contentIndexSchema = z
  .record(z.unknown())
  .nullish()
  .transform((map) => Object.keys(map ?? {}));

export const ENQUIRY_KINDS = ["contact", "notify"] as const;
/** What `/contact` and `NotifyMe` submit. `honeypot` must arrive empty. */
export const enquiryInputSchema = z.object({
  kind: z.enum(ENQUIRY_KINDS),
  name: looseText(200),
  email: z.string().trim().email().max(320),
  phone: looseText(40),
  message: looseText(2000),
  /** The product a "notify me" was raised against. */
  product: looseText(200),
  honeypot: looseText(200),
});

/**
 * What `/contact` submits, with the wording a visitor sees when a field is wrong.
 *
 * Stricter than `enquiryInputSchema` on `message`: the wire schema has to accept a
 * "notify me", which carries no message at all, while somebody writing to us on
 * the contact page has to actually say something.
 */
export const contactFormSchema = z.object({
  name: z.string().trim().min(1, "Please tell us your name.").max(200),
  email: z
    .string()
    .trim()
    .min(1, "We need an email address to reply to.")
    .email("That email address does not look right.")
    .max(320),
  phone: looseText(40),
  message: z
    .string()
    .trim()
    .min(1, "Please tell us about your enquiry.")
    .max(2000, "Please keep this under 2000 characters."),
  honeypot: looseText(200),
});

/** The launch waiting list: an address to write to, and nothing else. */
export const notifyFormSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Enter an email address.")
    .email("That email address does not look right.")
    .max(320),
  honeypot: looseText(200),
});

/** What the admin inbox reads back. Lenient: it must render older rows too. */
export const enquirySchema = z.object({
  kind: z.enum(ENQUIRY_KINDS).catch("contact"),
  name: readText(200),
  email: readText(320),
  phone: readText(40),
  message: readText(2000),
  product: readText(200),
  createdAt: readNumber,
  handled: readBoolean,
});

/** `enquiries` as the database returns it: keyed by push id, or absent. */
export const enquiryMapSchema = z
  .record(enquirySchema.nullable().catch(null))
  .nullish()
  .transform((map) => map ?? {});

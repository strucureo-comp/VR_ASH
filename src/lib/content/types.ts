import type { z } from "zod";

import type {
  benefitSchema,
  conditionSchema,
  contactFormSchema,
  enquiryInputSchema,
  enquirySchema,
  faqSchema,
  ingredientSchema,
  notifyFormSchema,
  productContentFormSchema,
  productContentSchema,
  sharedContentFormSchema,
  sharedContentSchema,
  stepSchema,
} from "./schema";

/**
 * Inferred rather than hand-written: `schema.ts` is the source of truth, and a
 * second declaration would only be a chance for the two to disagree.
 */

export type Benefit = z.output<typeof benefitSchema>;
export type Ingredient = z.output<typeof ingredientSchema>;
export type Step = z.output<typeof stepSchema>;
export type Condition = z.output<typeof conditionSchema>;
export type Faq = z.output<typeof faqSchema>;

export type ProductContent = z.output<typeof productContentSchema>;
export type SharedContent = z.output<typeof sharedContentSchema>;

export type ProductContentForm = z.output<typeof productContentFormSchema>;
export type SharedContentForm = z.output<typeof sharedContentFormSchema>;

export type EnquiryInput = z.output<typeof enquiryInputSchema>;
export type ContactForm = z.output<typeof contactFormSchema>;
export type NotifyForm = z.output<typeof notifyFormSchema>;
export type Enquiry = z.output<typeof enquirySchema>;
/** An inbox row: the stored enquiry plus its push id. */
export type EnquiryRecord = Enquiry & { id: string };

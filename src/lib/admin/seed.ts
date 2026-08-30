import type { LucideIcon } from "lucide-react";

import { FALLBACK_ICON_NAME, ICONS } from "@/lib/content/icons";
import type { ProductContentForm, SharedContentForm } from "@/lib/content/types";
import { BENEFITS, CERTIFICATIONS, CONDITIONS, FAQS, INGREDIENTS, STEPS } from "@/lib/site";

/**
 * Today's hard-coded copy, shaped for the editor's form.
 *
 * This exists so the switch from static arrays to the database is one click per
 * record instead of a retyping exercise, and so nothing has to be seeded from a
 * CLI holding credentials. Once every page reads from the database the arrays in
 * `site.ts` go away and this module goes with them.
 *
 * The seed is Soliderma's copy, so the button that calls it is only offered for
 * Soliderma — pouring one product's benefits into another would be worse than an
 * empty editor.
 */

/** The lists store an icon *component*; the database stores its name. */
function iconNameOf(icon: LucideIcon): string {
  const match = Object.entries(ICONS).find(([, component]) => component === icon);
  return match?.[0] ?? FALLBACK_ICON_NAME;
}

export function seedProductContent(): ProductContentForm {
  return {
    longDescription: "",
    directions: "",
    caution: "",
    benefits: BENEFITS.map((benefit) => ({ title: benefit.title, body: benefit.body })),
    ingredients: INGREDIENTS.map((ingredient) => ({
      name: ingredient.name,
      latin: ingredient.latin,
      part: ingredient.part,
    })),
    steps: STEPS.map((step) => ({ step: step.step, title: step.title, body: step.body })),
    conditions: CONDITIONS.map((condition) => ({
      icon: iconNameOf(condition.icon),
      title: condition.title,
      body: condition.body,
    })),
    faqs: [],
  };
}

export function seedSharedContent(): SharedContentForm {
  return {
    certifications: CERTIFICATIONS.map((certification) => ({
      icon: iconNameOf(certification.icon),
      title: certification.title,
      body: certification.body,
    })),
    faqs: FAQS.map((faq) => ({ q: faq.q, a: faq.a })),
  };
}

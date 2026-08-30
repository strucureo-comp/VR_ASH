import {
  Activity,
  Ambulance,
  Bandage,
  BedDouble,
  Boxes,
  Bug,
  Droplets,
  FileCheck2,
  FileText,
  Flame,
  GraduationCap,
  Leaf,
  Scissors,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";
import botanicals from "@/assets/botanicals.jpg";
import careRoutine from "@/assets/care-routine.jpg";
import leafTexture from "@/assets/leaf-texture.jpg";

export const WHATSAPP_NUMBER = "919445848148";
/** Same number, formatted for display / tel: links. */
export const PHONE_DISPLAY = "+91 94458 48148";
export const PHONE_TEL = "+919445848148";

export function whatsappLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/**
 * Enquiry only. Ordering happens through the Shopify cart and hosted checkout —
 * WhatsApp must not be offered as an order path, since nothing there produces a
 * real order, payment or inventory movement.
 */
export const WA_ENQUIRY = whatsappLink(
  "Hello Vallalaar Remedies, I have a question about Soliderma.",
);

export const WA_CLINIC = whatsappLink(
  "Hello Vallalaar Remedies, I am a healthcare professional and would like to discuss a clinic / bulk enquiry for Soliderma.",
);

/** "Notify me" for products that have not launched yet — no backend needed. */
export function waNotify(productName: string) {
  return whatsappLink(
    `Hello Vallalaar Remedies, please notify me when ${productName} becomes available.`,
  );
}

export const NAV = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Products" },
  { to: "/about", label: "About Us" },
  { to: "/certifications", label: "Our Science" },
  { to: "/wound-care", label: "Wellness Guide" },
  { to: "/clinics", label: "For Professionals" },
  { to: "/contact", label: "Contact" },
] as const;

export const BENEFITS = [
  {
    title: "Accelerates Healing",
    body: "Supports the wound-healing process as part of an appropriate wound-care routine.",
  },
  {
    title: "Improves Blood Flow",
    body: "Formulated with a stated focus on supporting blood flow.",
  },
  {
    title: "Antimicrobial Protection",
    body: "Provides antimicrobial protection as described in the product material.",
  },
  {
    title: "Anti-Inflammatory",
    body: "Designed with anti-inflammatory properties as part of its multi-action formulation.",
  },
];

/**
 * The single list of conditions Soliderma is positioned for. Rendered by the
 * home "Works On" grid, the /wound-care page it links to, the /soliderma
 * categories list and the /faq answer — keep it here, not in the routes, so
 * those four never drift apart again.
 */
export const CONDITIONS = [
  {
    icon: Droplets,
    title: "Diabetic Wound",
    body: "Supportive wound care for slow-healing wounds associated with diabetic conditions.",
  },
  {
    icon: BedDouble,
    title: "Bed Sores",
    body: "For pressure-related sores in bed-bound and long-term-care situations.",
  },
  {
    icon: Ambulance,
    title: "Accident Injuries",
    body: "For wound-care support following accidental injuries.",
  },
  {
    icon: Flame,
    title: "Burns / Post-Injuries",
    body: "For wound-care situations involving burn and fire injuries.",
  },
  {
    icon: Scissors,
    title: "Post-Surgical Care",
    body: "As part of the care routine set by your surgeon for a healing incision.",
  },
  {
    icon: Bug,
    title: "Skin Infections",
    body: "Antimicrobial support for the area under care, alongside professional advice.",
  },
  {
    icon: Activity,
    title: "Chronic Ulcers",
    body: "For long-standing ulcers being managed under practitioner supervision.",
  },
  {
    icon: Bandage,
    title: "Cuts & Abrasions",
    body: "Everyday herbal care for minor cuts, grazes and abrasions.",
  },
];

/**
 * Certificates and documentation actually held on file — the home strip,
 * /certifications and the metrics count all read from this one array, so the
 * number can never disagree with the list.
 *
 * NOTE: only add an entry once the certificate exists and can be produced on
 * request. "Clinically Researched" is a positioning claim, not a certificate,
 * so it sits in the hero trust badges instead.
 */
export const CERTIFICATIONS = [
  {
    icon: ShieldCheck,
    title: "WHO / GMP",
    body: "Manufactured in a WHO-GMP compliant facility under documented process controls.",
  },
  {
    icon: Leaf,
    title: "AYUSH",
    body: "Licensed as an Ayurvedic proprietary medicine under the applicable AYUSH framework.",
  },
  {
    icon: FileCheck2,
    title: "ISO 9001:2015",
    body: "Quality-management certification covering the manufacturing site.",
  },
];

export const INGREDIENTS = [
  { name: "Crustacean", latin: "Crustacea", part: "Powder" },
  { name: "Haridra", latin: "Curcuma longa", part: "Powder" },
  { name: "Kanyasara", latin: "Aloe barbadensis", part: "Dried Pulp" },
  { name: "Avartaki", latin: "Cassia auriculata", part: "Flowers" },
  { name: "Triphala", latin: "Terminalia chebula (Haritaki)", part: "Seeds" },
];

export const STEPS = [
  {
    step: "01",
    title: "Prepare the Area",
    body: "Clean the affected area according to the wound-care instructions provided by your healthcare professional.",
  },
  { step: "02", title: "Apply Soliderma", body: "Apply the spray as directed." },
  {
    step: "03",
    title: "Continue the Care Routine",
    body: "Follow the recommended wound-care protocol consistently.",
  },
  {
    step: "04",
    title: "Monitor Progress",
    body: "Observe the wound and follow professional medical guidance where required.",
  },
];

/**
 * The site-wide FAQ, shown on /faq.
 *
 * Two answers are assembled from the lists above so they cannot drift from the
 * pages they describe. Once /faq reads from the database this array becomes the
 * seed for `content/shared/faqs` and the two answers freeze as literal text —
 * self-updating counts are not worth a second source of truth.
 */
const CONDITION_LIST = CONDITIONS.map((c) => c.title.toLowerCase()).join(", ");
const CERT_LIST = CERTIFICATIONS.map((c) => c.title).join(", ");

export const FAQS = [
  {
    q: "What is Soliderma?",
    a: "Soliderma is an Ayurvedic proprietary medicine presented as a multi-action wound healing spray.",
  },
  {
    q: "What is Soliderma used for?",
    a: `It is used as part of the care routine for ${CONDITION_LIST}. It supports a wound-care plan rather than replacing one.`,
  },
  {
    q: "How should Soliderma be applied?",
    a: "Use according to the product instructions and the guidance of a qualified healthcare professional.",
  },
  {
    q: "Is Soliderma herbal?",
    a: "The product packaging identifies Soliderma as a herbal product.",
  },
  {
    q: "Where is Soliderma manufactured?",
    a: "The supplied material identifies Kniss Laboratories (P) Ltd. as the manufacturer. Vallalaar Remedies markets the product.",
  },
  {
    q: "What certifications does it hold?",
    a: `${CERT_LIST}. Certificates and regulatory documentation are listed on the Our Science page and can be provided on request.`,
  },
  {
    q: "What does Soliderma cost?",
    a: "Live prices are shown on each product page and in the cart, per size. Shipping and any taxes are calculated at checkout.",
  },
  {
    q: "Can I order Soliderma online?",
    a: "Yes. Add the size you need to the cart and check out — payment is processed securely by our Shopify checkout, and you will receive an order confirmation by email.",
  },
  {
    q: "Can clinics order in bulk?",
    a: "Yes. A dedicated clinic / practitioner enquiry pathway is provided for bulk and professional requirements.",
  },
  {
    q: "Can I use Soliderma without medical advice?",
    a: "For significant, infected, deep, diabetic or otherwise serious wounds, users should seek appropriate professional medical care. Product use should follow the approved instructions.",
  },
];

/**
 * Home-page marketing copy.
 *
 * NOTE: the metrics bar and the testimonials below are customer-supplied
 * claims. Keep them in sync with what can actually be evidenced (certificates
 * on file, consented patient quotes).
 */
const METRIC_CLAIMS = [
  { value: "10+", label: "Years of Trust" },
  { value: "5000+", label: "Doctors Trusted" },
  { value: "1M+", label: "Lives Touched" },
];

/**
 * The certification count is the one metric that is counted rather than claimed,
 * so the pages that read `content/shared` pass the saved list's length in — the
 * bar can then never disagree with what /certifications actually shows.
 */
export function metrics(certificationCount: number) {
  return [...METRIC_CLAIMS, { value: String(certificationCount), label: "Certifications" }];
}

export const ABOUT_SNIPPET =
  "Vallalaar Remedies is a Chennai-based Ayurvedic company built around a single idea — that traditional herbal wound care deserves modern manufacturing discipline. Soliderma is produced for us by Kniss Laboratories (P) Ltd. in a WHO-GMP compliant facility, from a formulation refined through years of practitioner feedback, so families and clinicians get the same result every time.";

export const TESTIMONIALS = [
  {
    name: "Joy",
    role: "Diabetic wound care",
    rating: 5,
    quote:
      "We used the spray alongside the dressing routine our doctor set. The daily care became far simpler to keep up with.",
  },
  {
    name: "Mohan",
    role: "Post-surgical care",
    rating: 5,
    quote: "Easy to apply without touching the area, which mattered a lot during recovery at home.",
  },
  {
    name: "Thameem",
    role: "Long-term wound care",
    rating: 5,
    quote:
      "A herbal option that our practitioner was comfortable including in the care plan. We stayed consistent with it.",
  },
];

/**
 * Wellness-guide articles. The home cards link to `/wound-care#<slug>`, where
 * the same entry is rendered in full — so "Read More" always lands on the
 * article it advertised.
 */
export const GUIDES = [
  {
    slug: "chronic-wounds-at-home",
    image: careRoutine,
    tag: "Home Care",
    title: "How to care for chronic wounds at home",
    body: "A practical routine for cleaning, dressing and tracking a slow-healing wound between clinic visits.",
    points: [
      "Wash your hands and lay out fresh dressings before you uncover the wound.",
      "Clean the area exactly as your practitioner directed — do not improvise with antiseptics.",
      "Apply Soliderma from a short distance so nothing touches the wound bed, then re-dress.",
      "Photograph the wound weekly in the same light; it is the easiest way to see slow progress.",
      "Call your practitioner if there is new pain, spreading redness, odour or fever.",
    ],
  },
  {
    slug: "bed-sores-prevention",
    image: botanicals,
    tag: "Prevention",
    title: "Managing bed sores in bed-bound patients",
    body: "Repositioning, pressure relief and the early signs that need a professional opinion.",
    points: [
      "Reposition at least every two hours, alternating sides and using pillows to offload the hips and heels.",
      "Check the tailbone, heels, elbows and shoulder blades daily — press the skin and watch whether the redness fades.",
      "Keep skin dry and the bedding wrinkle-free; moisture and friction do most of the damage.",
      "Redness that does not fade, or any break in the skin, needs a professional assessment.",
    ],
  },
  {
    slug: "diabetic-foot-checks",
    image: leafTexture,
    tag: "Diabetes",
    title: "Daily foot checks for diabetic patients",
    body: "What to look for, what to record, and when a small wound stops being small.",
    points: [
      "Check both feet once a day, including between the toes and under the heel — use a mirror if needed.",
      "Look for cuts, blisters, colour changes, swelling and anything warm to the touch.",
      "Never walk barefoot, and check footwear for grit before putting it on.",
      "A wound that has not started closing within a few days needs to be seen, however small it looks.",
    ],
  },
];

export const PRO_POINTS = [
  {
    icon: Boxes,
    title: "Bulk Orders",
    body: "Institutional pricing and supply schedules for clinics, hospitals and pharmacies.",
  },
  {
    icon: GraduationCap,
    title: "Product Training",
    body: "Application guidance and formulation briefings for your nursing and care staff.",
  },
  {
    icon: Stethoscope,
    title: "Clinical Support",
    body: "Direct line to our team for case-specific questions and documentation.",
  },
  {
    icon: FileText,
    title: "Certification Documents",
    body: "Manufacturing licence, certificates and product documentation on request.",
  },
];

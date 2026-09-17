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
  { to: "/clinics", label: "For Professionals" },
  { to: "/contact", label: "Contact" },
] as const;

export function cleanSoliderma(text: string): string {
  if (!text) return "";
  return text.replace(/SOLIDERMA[®️™]*/gi, "SOLIDERMA");
}


export const BENEFITS = [
  {
    title: "Expedited Healing",
    body: "Uses powerful plant-based ingredients to help your skin heal naturally and rebuild healthy tissue.",
  },
  {
    title: "Enhanced Microcirculation",
    body: "Improves blood flow and oxygen to the wound area, delivering the vital nutrients needed for faster healing.",
  },
  {
    title: "Antimicrobial Safeguard",
    body: "Creates a protective barrier that fights off bacteria and stops infections from spreading.",
  },
  {
    title: "Scar Modulation",
    body: "Supports the skin's natural repair process to help minimize the appearance of scars over time.",
  },
];

/**
 * The single list of conditions Soliderma is positioned for.
 * SOLIDERMA is formulated for complex wounds that need ongoing, daily care, helping the skin progress steadily through every stage of healing.
 */
export const CONDITIONS = [
  {
    icon: Droplets,
    title: "Diabetic Foot Ulcers",
    body: "Designed to improve circulation and promote healthy skin recovery in slow-healing diabetic wounds.",
  },
  {
    icon: BedDouble,
    title: "Decubitus Ulcers (Bed Sores)",
    body: "Disciplined care for pressure-induced tissue breakdown in bed-bound and long-term care patients.",
  },
  {
    icon: Flame,
    title: "Thermal Injuries (Fire Burns)",
    body: "Immediate cooling soothing and bio-regenerative support for superficial and partial-thickness burn injuries.",
  },
  {
    icon: Ambulance,
    title: "Accidental Trauma Wounds",
    body: "Rapid antimicrobial defense and accelerated tissue repair following acute accidental trauma.",
  },
  {
    icon: Scissors,
    title: "Post-Operative Surgical Wounds",
    body: "Clean, touch-free barrier protection facilitating disciplined incision healing and scar reduction.",
  },
  {
    icon: Activity,
    title: "Chronic Non-Healing Wounds",
    body: "Supportive topical therapy to assist wound progression through key healing phases.",
  },
];

/**
 * Certificates and documentation actually held on file.
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
  { name: "Crustacean Extract", latin: "Crustacea", part: "30 mg" },
  { name: "Haridra", latin: "Curcuma longa", part: "0.1 mg" },
  { name: "Kanyasara", latin: "Aloe barbadensis", part: "10 mg" },
  { name: "Avartaki", latin: "Cassia auriculata", part: "50 mg" },
  { name: "Triphala", latin: "Terminalia chebula (Haritaki)", part: "30 mg" },
  { name: "IPA Base", latin: "Isopropanol Base", part: "q.s." },
];

export const STEPS = [
  {
    step: "01",
    title: "Shake Well",
    body: "Shake well before each application.",
  },
  {
    step: "02",
    title: "Spray Generously",
    body: "Spray generously over the wound bed.",
  },
  {
    step: "03",
    title: "Apply 3–4 Times Daily",
    body: "Apply 3–4 times daily, or as advised by a medical professional.",
  },
  {
    step: "04",
    title: "Medical Dressings",
    body: "Suitable under medical dressings.",
  },
];

/**
 * The site-wide FAQ, shown on /faq.
 */
const CONDITION_LIST = CONDITIONS.map((c) => c.title.toLowerCase()).join(", ");
const CERT_LIST = CERTIFICATIONS.map((c) => c.title).join(", ");

export const FAQS = [
  {
    q: "Is SOLIDERMA suitable for diabetic patients?",
    a: "Yes. As indicated on the product label, SOLIDERMA is formulated to support healing in diabetic foot ulcers. However, all diabetic wound care should be supervised by a licensed medical professional.",
  },
  {
    q: "Can it be used on chronic non-healing wounds?",
    a: "SOLIDERMA is designed to assist wound progression through key healing phases. Chronic wounds require medical assessment; SOLIDERMA functions as a supportive topical therapy.",
  },
  {
    q: "Is the formula purely herbal?",
    a: "The formulation contains multiple traditional herbal actives selected for their historical therapeutic value, synergistic activity, and contribution to cutaneous homeostasis.",
  },
  {
    q: "How soon can results be expected?",
    a: "Healing times depend on the depth of the wound and your overall health, but SOLIDERMA works continuously to support and speed up your body's natural healing process.",
  },
  {
    q: "What is SOLIDERMA used for?",
    a: `It is engineered for complex wounds that demand more, including ${CONDITION_LIST}. It supports a structured wound-care plan.`,
  },
  {
    q: "Where is SOLIDERMA manufactured?",
    a: "Manufactured by KNISS Laboratories (P) Ltd. (Mfg. Lic. No.: 1055) and marketed by Vallalaar Remedies, Chennai.",
  },
  {
    q: "What certifications does it hold?",
    a: `${CERT_LIST}. Certificates and regulatory documentation are listed on the Our Science page.`,
  },
  {
    q: "Can clinics and hospitals order in bulk?",
    a: "Yes. Institutional supply is available for wound-care centres, diabetic care clinics, geriatric care units, and hospitals.",
  },
];

/**
 * Verified regulatory metrics replacing unverified marketing claims.
 */
export function metrics(_certificationCount?: number) {
  return [
    { value: "WHO-GMP", label: "Compliant Facility" },
    { value: "AYUSH", label: "Proprietary Medicine" },
    { value: "ISO 9001", label: "Quality Certified" },
    { value: "Batch Tested", label: "Quality Assured" },
  ];
}

export const ABOUT_SNIPPET =
  "Combining the wisdom of Ayurveda with modern science. We are dedicated to creating pure, high-quality herbal remedies you can trust. SOLIDERMA is manufactured by KNISS Laboratories (P) Ltd. under WHO-GMP compliance.";

export const MANUFACTURER_INFO = {
  name: "KNISS Laboratories (P) Ltd.",
  licence: "Mfg. Lic. No.: 1055",
  marketedBy: "Vallalaar Remedies",
  address: "25/5, Nathamuni Street, T. Nagar, Chennai – 600 017",
  phone: "+91 94458 48148",
};

export const DISCLAIMER =
  "This website conveys information consistent with the product label. It is not a substitute for physician consultation. For severe, spreading, or infected wounds particularly in diabetic individuals professional medical care is essential.";

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

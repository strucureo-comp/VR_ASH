export const WHATSAPP_NUMBER = "919445848148";

export function whatsappLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export const WA_ORDER = whatsappLink(
  "Hello Vallalaar Remedies, I would like to order Soliderma Multi Action Wound Healing Spray.",
);

export const WA_CLINIC = whatsappLink(
  "Hello Vallalaar Remedies, I am a healthcare professional and would like to discuss a clinic / bulk enquiry for Soliderma.",
);

export const NAV = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Products" },
  { to: "/wound-care", label: "Wound Care" },
  { to: "/certifications", label: "Certifications" },
  { to: "/clinics", label: "For Clinics" },
  { to: "/about", label: "About" },
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

export const WOUND_CATEGORIES = [
  {
    title: "Diabetic Wounds",
    body: "Supportive wound care for wounds associated with diabetic conditions.",
  },
  { title: "Bed Sores", body: "For wound-care situations involving pressure-related sores." },
  { title: "Accident Injuries", body: "For wound-care support following accidental injuries." },
  { title: "Fire Injuries", body: "For wound-care situations involving burn injuries." },
];

export const INGREDIENTS = [
  { name: "Crustacean", latin: "Crustacea", part: "Powder" },
  { name: "Haridra", latin: "Curcuma longa", part: "Powder" },
  { name: "Kanyasara", latin: "Aloe barbadensis", part: "Dried Pulp" },
  { name: "Avartaki", latin: "Cassia auriculata", part: "Flowers" },
  { name: "Triphala", latin: "Terminalia chebula (Haritaki)", part: "Seeds" },
];

export const CASES = [
  { id: "01", name: "Joy", line: "From wound care to visible progress." },
  { id: "02", name: "Mohan", line: "A journey of consistent wound care." },
  { id: "03", name: "Thameem", line: "Following the healing journey step by step." },
  { id: "04", name: "Arokiya Samy", line: "Documented wound-care progress." },
  { id: "05", name: "Grace", line: "Another real-world healing journey." },
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

export const TRUST_BADGES = [
  "Ayurvedic Proprietary Medicine",
  "Herbal Formulation",
  "WHO / GMP / AYUSH",
  "ISO 9001:2015",
];

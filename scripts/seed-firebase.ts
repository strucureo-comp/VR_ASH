const FIREBASE_DATABASE_URL =
  process.env["FIREBASE_DATABASE_URL"] ||
  "https://site-9d50d-default-rtdb.asia-southeast1.firebasedatabase.app";

const PRODUCT_ID = "9861436735705";

const productContent = {
  updatedAt: Date.now(),
  longDescription: `A distinguished fusion of time-honoured Ayurvedic botanicals and contemporary topical delivery science, SOLIDERMA®️ redefines wound management with elegance, efficacy, and absolute purity. Designed to accelerate dermal repair, enhance perfusion, support microbial defense, and minimise scarring, this sophisticated spray embodies the future of natural wound therapeutics.

SOLIDERMA®️ operates at the intersection of phytopharmacology, cutaneous bio-restoration, and modern wound-care principles. Clinically Intentional. Doctor-Trusted. Herbal-Powered.`,
  directions: `• Shake well before each application.
• Spray generously over the wound bed.
• Apply 3–4 times daily, or as advised by a medical professional.
• Suitable under medical dressings.`,
  caution: `• External application only.
• Store cool and dry, away from direct sunlight.
• Keep out of reach of children.
• Discontinue if irritation occurs.
• Consult a clinician for deep, infected, or non-healing wounds, especially diabetic wounds.`,
  benefits: [
    {
      title: "Expedited Healing",
      body: "Encourages efficient tissue regeneration through active phytopharmacological bio-restoration.",
    },
    {
      title: "Enhanced Microcirculation",
      body: "Assists localized vasodilation and tissue oxygenation for vital nutrient delivery.",
    },
    {
      title: "Antimicrobial Safeguard",
      body: "Supports robust defense against microbial burden and infection progression.",
    },
    {
      title: "Scar Modulation",
      body: "Facilitates balanced remodeling and maturation for significantly reduced scar visibility.",
    },
  ],
  ingredients: [
    {
      name: "Crustacean Extract",
      latin: "Crustacea",
      part: "30 mg",
    },
    {
      name: "Haridra",
      latin: "Curcuma longa",
      part: "0.1 mg",
    },
    {
      name: "Kanyasara",
      latin: "Aloe barbadensis",
      part: "10 mg",
    },
    {
      name: "Avartaki",
      latin: "Cassia auriculata",
      part: "50 mg",
    },
    {
      name: "Triphala",
      latin: "Terminalia chebula (Haritaki)",
      part: "30 mg",
    },
    {
      name: "IPA Base",
      latin: "Isopropanol Base",
      part: "q.s.",
    },
  ],
  steps: [
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
  ],
  conditions: [
    {
      icon: "Droplets",
      title: "Diabetic Foot Ulcers",
      body: "Supportive dermal restoration and microvascular activation for slow-healing diabetic ulcerations.",
    },
    {
      icon: "BedDouble",
      title: "Decubitus Ulcers (Bed Sores)",
      body: "Disciplined care for pressure-induced tissue breakdown in bed-bound and long-term care patients.",
    },
    {
      icon: "Flame",
      title: "Thermal Injuries (Fire Burns)",
      body: "Immediate cooling soothing and bio-regenerative support for superficial and partial-thickness burns.",
    },
    {
      icon: "Ambulance",
      title: "Accidental Trauma Wounds",
      body: "Rapid antimicrobial defense and accelerated tissue repair following acute accidental trauma.",
    },
    {
      icon: "Scissors",
      title: "Post-Operative Surgical Wounds",
      body: "Clean, touch-free barrier protection facilitating disciplined incision healing and scar reduction.",
    },
    {
      icon: "Activity",
      title: "Chronic Non-Healing Wounds",
      body: "Supportive topical therapy designed to assist wound progression through key healing phases.",
    },
  ],
  faqs: [
    {
      q: "Is SOLIDERMA®️ suitable for diabetic patients?",
      a: "Yes. As indicated on the product label, SOLIDERMA®️ is formulated to support healing in diabetic foot ulcers. However, all diabetic wound care should be supervised by a licensed medical professional.",
    },
    {
      q: "Can it be used on chronic non-healing wounds?",
      a: "SOLIDERMA®️ is designed to assist wound progression through key healing phases. Chronic wounds require medical assessment; SOLIDERMA®️ functions as a supportive topical therapy.",
    },
    {
      q: "Is the formula purely herbal?",
      a: "The formulation contains multiple traditional herbal actives selected for their historical therapeutic value, synergistic activity, and contribution to cutaneous homeostasis.",
    },
    {
      q: "How soon can results be expected?",
      a: "Healing outcomes vary by wound depth, vascularity, patient health, and compliance. SOLIDERMA®️ assists natural physiological healing mechanisms.",
    },
  ],
};

const sharedContent = {
  updatedAt: Date.now(),
  certifications: [
    {
      icon: "ShieldCheck",
      title: "WHO / GMP",
      body: "Manufactured in a WHO-GMP compliant facility under documented process controls.",
    },
    {
      icon: "Leaf",
      title: "AYUSH",
      body: "Licensed as an Ayurvedic proprietary medicine under the applicable AYUSH framework.",
    },
    {
      icon: "FileCheck2",
      title: "ISO 9001:2015",
      body: "Quality-management certification covering the manufacturing site.",
    },
  ],
  faqs: [
    {
      q: "Is SOLIDERMA®️ suitable for diabetic patients?",
      a: "Yes. As indicated on the product label, SOLIDERMA®️ is formulated to support healing in diabetic foot ulcers. However, all diabetic wound care should be supervised by a licensed medical professional.",
    },
    {
      q: "Can it be used on chronic non-healing wounds?",
      a: "SOLIDERMA®️ is designed to assist wound progression through key healing phases. Chronic wounds require medical assessment; SOLIDERMA®️ functions as a supportive topical therapy.",
    },
    {
      q: "Is the formula purely herbal?",
      a: "The formulation contains multiple traditional herbal actives selected for their synergistic therapeutic value and contribution to cutaneous homeostasis.",
    },
    {
      q: "How soon can results be expected?",
      a: "Healing outcomes vary by wound depth, vascularity, patient health, and compliance. SOLIDERMA®️ assists natural physiological healing mechanisms.",
    },
    {
      q: "What is SOLIDERMA®️ used for?",
      a: "Engineered for complex wounds that demand more: Diabetic Foot Ulcers, Decubitus Ulcers (Bed Sores), Thermal Injuries, Accidental Trauma, Post-Operative Surgical Wounds, and Chronic Non-Healing Wounds.",
    },
    {
      q: "Where is SOLIDERMA®️ manufactured?",
      a: "Manufactured by KNISS Laboratories (P) Ltd. (Mfg. Lic. No.: 1055) and marketed by Vallalaar Remedies, Chennai.",
    },
    {
      q: "What certifications does it hold?",
      a: "WHO / GMP, AYUSH, and ISO 9001:2015. Certificates and regulatory documentation are listed on the Our Science page.",
    },
    {
      q: "Can clinics and hospitals order in bulk?",
      a: "Yes. Institutional supply is available for wound-care centres, diabetic care clinics, geriatric care units, and hospitals.",
    },
  ],
};

async function seed() {
  console.log(`Seeding Firebase RTDB at ${FIREBASE_DATABASE_URL}...`);

  const productRes = await fetch(
    `${FIREBASE_DATABASE_URL}/content/products/${PRODUCT_ID}.json`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productContent),
    }
  );

  if (!productRes.ok) {
    throw new Error(`Failed to seed product: ${productRes.status} ${productRes.statusText}`);
  }
  console.log("✓ Successfully seeded content/products/" + PRODUCT_ID);

  const sharedRes = await fetch(`${FIREBASE_DATABASE_URL}/content/shared.json`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(sharedContent),
  });

  if (!sharedRes.ok) {
    throw new Error(`Failed to seed shared content: ${sharedRes.status} ${sharedRes.statusText}`);
  }
  console.log("✓ Successfully seeded content/shared");
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});

import { Reveal } from "@/components/site/Reveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Section } from "@/components/site/Section";

export function SolidermaScience() {
  return (
    <Section className="bg-[color:var(--surface)] border-t border-border/50">
      <Reveal>
        <h2 className="font-serif text-3xl sm:text-4xl text-foreground">
          The Science of Soliderma<span className="text-sm align-top">®️</span>
        </h2>
        <p className="mt-3 text-lg font-medium text-[color:var(--botanical)]">
          A Multi-Dimensional Mechanism of Dermal Restoration
        </p>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="font-semibold text-foreground">1. Microvascular Activation</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Promotes localized vasodilation, aiding enhanced perfusion and nutrient delivery to compromised tissue.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="font-semibold text-foreground">2. Immuno-Cellular Recruitment</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Encourages infiltration of neutrophils and macrophages—the body's essential cellular custodians for debridement and early wound healing.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="font-semibold text-foreground">3. Microbial Protection</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Formulated to support an environment unfavourable to microbial proliferation, assisting in preventing infection progression.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="font-semibold text-foreground">4. Remodeling & Scar Optimization</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Aids the later phases of wound maturation to support refined, less prominent scar formation.
            </p>
          </div>
        </div>
        <p className="mt-8 max-w-2xl text-sm italic text-muted-foreground">
          SOLIDERMA®️ integrates traditional Ayurvedic intelligence with modern cutaneous physiology for a truly holistic wound-healing strategy.
        </p>
      </Reveal>
    </Section>
  );
}

export function SolidermaWhoShouldUse() {
  return (
    <Section className="bg-[color:var(--surface)] pb-12 sm:pb-16 border-t border-border/50 pt-16 sm:pt-20">
      <Reveal>
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-serif text-3xl sm:text-4xl text-foreground">Who Should Use Soliderma<span className="text-sm align-top">®️</span>?</h2>
          <p className="mt-6 text-sm sm:text-base leading-relaxed text-muted-foreground">
            SOLIDERMA®️ is ideal for:
            <br /><br />
            Patients, caregivers, wound-care centres, diabetic care clinics, geriatric care units, surgical departments, home care providers, and long-term healing facilities seeking a refined, herbal, non-invasive wound solution.
          </p>
        </div>
      </Reveal>
    </Section>
  );
}

export function SolidermaPresentationSafety({ content }: { content: any }) {
  return (
    <Section className="bg-[color:var(--surface)] border-t border-border/50">
      <Reveal>
        <div className="grid gap-8 sm:grid-cols-2">
          <div className="rounded-2xl bg-[color:var(--ivory)] p-6 sm:p-8 border border-border shadow-sm">
            <h2 className="font-serif text-2xl text-foreground">Product Presentation</h2>
            <div className="mt-4 space-y-2 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">SOLIDERMA®️ Multi-Action Wound Healing Spray</p>
              <p>External Use Only | 50 ml & 100 ml | Ayurvedic Proprietary Medicine</p>
              <p className="pt-2 border-t border-border/50">
                Manufactured by KNISS Laboratories (P) Ltd., marketed by Vallalaar Remedies, Chennai.
              </p>
            </div>
          </div>

          {content?.caution && (
            <div className="rounded-2xl border border-[color:var(--burgundy)]/20 bg-card p-6 sm:p-8 shadow-sm">
              <h2 className="font-serif text-2xl text-foreground">Safety & Storage</h2>
              <p className="mt-4 text-sm leading-relaxed whitespace-pre-line text-[color:var(--burgundy)]">
                {content.caution}
              </p>
            </div>
          )}
        </div>
      </Reveal>
    </Section>
  );
}

export function SolidermaFAQs({ content }: { content: any }) {
  if (!content?.faqs || content.faqs.length === 0) return null;
  
  return (
    <Section className="bg-background border-t border-border">
      <Reveal>
        <div className="text-center">
          <h2 className="font-serif text-3xl sm:text-4xl text-foreground">Frequently Asked Questions</h2>
          <p className="mt-3 text-[color:var(--gold)] eyebrow tracking-widest text-xs">ELEVATED EDITION</p>
        </div>
        <Accordion type="single" collapsible className="mt-10 mx-auto w-full max-w-3xl">
          {content.faqs.map((f: any, i: number) => (
            <AccordionItem key={f.q} value={`item-${i}`}>
              <AccordionTrigger className="text-left font-serif text-base sm:text-lg">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Reveal>
    </Section>
  );
}

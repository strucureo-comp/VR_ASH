import type { ReactNode } from "react";
import { Reveal } from "./Reveal";
import { Section, Note } from "./Section";

export type PolicySection = { heading: string; body: ReactNode };

/**
 * Shared layout for the footer policy pages (shipping, terms, privacy).
 * `draft` renders a visible notice — these pages ship as working drafts until
 * the final text is signed off.
 */
export function PolicyPage({
  eyebrow,
  title,
  intro,
  sections,
  updated,
  draft = true,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  sections: PolicySection[];
  updated: string;
  draft?: boolean;
}) {
  return (
    <Section className="bg-[color:var(--surface)]">
      <Reveal>
        <p className="eyebrow text-[color:var(--gold)]">{eyebrow}</p>
        <h1 className="mt-4 max-w-3xl text-[2rem] leading-tight text-foreground sm:mt-5 sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">{intro}</p>
        <p className="mt-4 text-xs uppercase tracking-[0.16em] text-muted-foreground">
          Last updated: {updated}
        </p>
      </Reveal>

      <div className="mt-14 max-w-3xl space-y-10">
        {sections.map((s, i) => (
          <Reveal key={s.heading} delay={i * 0.05}>
            <h2 className="text-2xl text-foreground">{s.heading}</h2>
            <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground">
              {s.body}
            </div>
          </Reveal>
        ))}
      </div>

      {draft && (
        <Note>
          Working draft. This page is published for reference and is pending final review — please
          confirm the terms with our team before relying on them.
        </Note>
      )}
    </Section>
  );
}

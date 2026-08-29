import type { ReactNode } from "react";

export function SectionLabel({ index, label }: { index: string; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="eyebrow text-[color:var(--gold)]">{index}</span>
      <span className="h-px w-8 bg-border" />
      <span className="eyebrow text-muted-foreground">{label}</span>
    </div>
  );
}

export function Section({
  children,
  className = "",
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`px-5 py-16 sm:px-6 sm:py-24 lg:py-28 ${className}`}>
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  );
}

export function Note({ children }: { children: ReactNode }) {
  return (
    <p className="mt-8 max-w-3xl border-l-2 border-[color:var(--gold)] pl-4 text-xs leading-relaxed text-muted-foreground sm:mt-10">
      {children}
    </p>
  );
}

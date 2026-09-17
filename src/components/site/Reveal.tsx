import type { ReactNode } from "react";

export function Reveal({
  children,
  delay: _delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}

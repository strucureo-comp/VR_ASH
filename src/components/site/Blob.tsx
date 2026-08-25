/**
 * Decorative organic blob shapes used behind product imagery.
 * Purely presentational — always aria-hidden.
 */
export function Blob({
  className = "",
  variant = 1,
  color = "var(--botanical)",
  opacity = 1,
}: {
  className?: string;
  variant?: 1 | 2 | 3;
  color?: string;
  opacity?: number;
}) {
  const paths = {
    1: "M427 24c86 22 140 96 158 178 18 82 0 172-52 236-52 64-138 102-224 96-86-6-172-56-216-132C49 326 47 222 96 148 145 74 245 22 331 15c32-3 64-1 96 9Z",
    2: "M300 8c110 0 210 62 252 158 42 96 26 226-52 300-78 74-208 92-306 52C96 478 22 380 12 274 2 168 60 66 158 28c46-18 96-20 142-20Z",
    3: "M240 4c132-12 250 66 274 186 24 120-46 250-160 292-114 42-262-4-320-114C-24 258 12 108 118 44 156 21 198 8 240 4Z",
  } as const;

  return (
    <svg
      viewBox="0 0 500 500"
      aria-hidden="true"
      className={`pointer-events-none absolute ${className}`}
      style={{ opacity }}
    >
      <path d={paths[variant]} fill={color} />
    </svg>
  );
}

import mark from "@/assets/vallalaar-mark.png";

export function Logo({ tone = "dark" }: { tone?: "dark" | "light" }) {
  return (
    <span className="flex items-center gap-3">
      <img
        src={mark}
        alt="Vallalaar Remedies leaf emblem"
        width={512}
        height={512}
        className="h-9 w-9 shrink-0"
      />
      <span className="leading-tight">
        <span
          className={`block font-display text-base tracking-tight sm:text-lg ${
            tone === "light" ? "text-primary-foreground" : "text-foreground"
          }`}
        >
          Vallalaar Remedies
        </span>
        <span
          className={`eyebrow block text-[0.6rem] ${
            tone === "light" ? "text-primary-foreground/70" : "text-muted-foreground"
          }`}
        >
          Ayurvedic Healthcare
        </span>
      </span>
    </span>
  );
}

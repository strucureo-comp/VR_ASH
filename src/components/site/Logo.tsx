import logo from "@/assets/logo.png";

export function Logo({ tone = "dark" }: { tone?: "dark" | "light" }) {
  return (
    <span className="flex items-center gap-2.5 sm:gap-3">
      <img
        src={logo}
        alt="Vallalaar Remedies emblem"
        width={1279}
        height={1230}
        className="h-9 w-auto shrink-0 object-contain drop-shadow-sm sm:h-10"
      />
      <span className="leading-tight">
        <span
          className={`block font-display text-base font-semibold tracking-tight sm:text-lg ${
            tone === "light" ? "text-primary-foreground" : "text-foreground"
          }`}
        >
          Vallalaar Remedies
        </span>
        <span
          className={`eyebrow block text-[0.6rem] tracking-wider ${
            tone === "light" ? "text-primary-foreground/70" : "text-muted-foreground"
          }`}
        >
          Ayurvedic Healthcare
        </span>
      </span>
    </span>
  );
}

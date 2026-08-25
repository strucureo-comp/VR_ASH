import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";

const links = [
  { to: "/", label: "Home" },
  { to: "/soliderma", label: "Products" },
  { to: "/about", label: "About Us" },
  { to: "/soliderma", label: "How to Use" },
  { to: "/certifications", label: "Certifications" },
  { to: "/faq", label: "FAQ" },
  { to: "/wound-care", label: "Wound Care" },
  { to: "/clinics", label: "For Clinics" },
  { to: "/contact", label: "Contact" },
];

export function Footer() {
  return (
    <footer className="bg-[color:var(--botanical-deep)] text-primary-foreground">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <Logo tone="light" />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-primary-foreground/70">
            Ayurvedic healthcare, presented with modern convenience.
          </p>
        </div>

        <div>
          <h3 className="eyebrow text-primary-foreground/60">Explore</h3>
          <ul className="mt-4 grid grid-cols-2 gap-y-2 text-sm">
            {links.map((l) => (
              <li key={l.label}>
                <Link
                  to={l.to}
                  className="text-primary-foreground/80 transition-colors hover:text-primary-foreground"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="text-sm text-primary-foreground/80">
          <h3 className="eyebrow text-primary-foreground/60">Soliderma&trade;</h3>
          <p className="mt-4">Multi Action Wound Healing Spray</p>
          <p className="mt-5 leading-relaxed">
            25/5, Nathamuni Street,
            <br />
            T. Nagar, Chennai &ndash; 600 017
          </p>
          <a href="tel:+919445848148" className="mt-3 inline-block hover:text-primary-foreground">
            94458 48148
          </a>
        </div>
      </div>
      <div className="border-t border-primary-foreground/15 py-6 text-center text-xs text-primary-foreground/60">
        &copy; {new Date().getFullYear()} Vallalaar Remedies. All Rights Reserved.
      </div>
    </footer>
  );
}

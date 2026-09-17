import { Link } from "@tanstack/react-router";
import { MessageCircle, MapPin, Phone, Mail } from "lucide-react";
import { Logo } from "./Logo";
import { PHONE_DISPLAY, PHONE_TEL, WA_ENQUIRY } from "@/lib/site";

type FooterLink = { to: string; hash?: string; label: string };

const quickLinks: FooterLink[] = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Products" },
  { to: "/about", label: "About Us" },
  { to: "/certifications", label: "Our Science" },
  { to: "/", hash: "testimonials", label: "Testimonials" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Contact" },
];

const supportLinks: FooterLink[] = [
  { to: "/clinics", label: "For Professionals" },
  { to: "/clinics", label: "Bulk Orders" },
  { to: "/shipping", label: "Shipping & Returns" },
  { to: "/terms", label: "Terms & Conditions" },
  { to: "/privacy", label: "Privacy Policy" },
];

const linkClass = "text-primary-foreground/75 transition-colors hover:text-primary-foreground";

export function Footer() {
  return (
    <footer className="bg-[color:var(--botanical-deep)] text-primary-foreground">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-5 py-12 sm:gap-10 sm:px-6 sm:py-16 lg:grid-cols-[1.4fr_1fr_1fr_1.1fr] lg:gap-12">
        <div className="col-span-2 lg:col-span-1">
          <Logo tone="light" />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-primary-foreground/70">
            Vallalaar Remedies — an Ayurvedic healthcare brand from Chennai. Herbal formulations
            manufactured with modern quality discipline.
          </p>
          <ul className="mt-6 space-y-3 text-sm text-primary-foreground/75">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--gold)]" />
              <span>
                25/5, Nathamuni Street,
                <br />
                T. Nagar, Chennai – 600 017
              </span>
            </li>
            <li className="flex gap-3">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--gold)]" />
              <a href={`tel:${PHONE_TEL}`} className={linkClass}>
                {PHONE_DISPLAY}
              </a>
            </li>
            <li className="flex gap-3">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--gold)]" />
              <Link to="/contact" className={linkClass}>
                Send an enquiry
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="eyebrow text-primary-foreground/60">Quick Links</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {quickLinks.map((l) => (
              <li key={l.label}>
                <Link to={l.to} {...(l.hash ? { hash: l.hash } : {})} className={linkClass}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="eyebrow text-primary-foreground/60">Support</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {supportLinks.map((l) => (
              <li key={l.label}>
                <Link to={l.to} {...(l.hash ? { hash: l.hash } : {})} className={linkClass}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="col-span-2 lg:col-span-1">
          <h3 className="eyebrow text-primary-foreground/60">Order &amp; Enquiries</h3>
          <p className="mt-4 text-sm leading-relaxed text-primary-foreground/70">
            Fastest way to reach us — message our team directly about products, sizes and clinic
            enquiries.
          </p>
          <a
            href={WA_ENQUIRY}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary-foreground px-6 py-3 text-sm font-semibold text-[color:var(--botanical-deep)] transition-transform duration-300 hover:-translate-y-0.5"
          >
            <MessageCircle className="h-4 w-4" />
            Chat on WhatsApp
          </a>
        </div>
      </div>

      {/* DISCLAIMER BANNER */}
      <div className="border-t border-primary-foreground/15 bg-black/20 px-5 py-5 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <p className="text-[11px] sm:text-xs leading-relaxed text-primary-foreground/60 text-center sm:text-left">
            <strong className="text-primary-foreground/80 uppercase tracking-wider mr-1.5">Disclaimer:</strong>
            This website conveys information consistent with the product label. It is not a substitute for physician consultation. For severe, spreading, or infected wounds particularly in diabetic individuals professional medical care is essential.
          </p>
        </div>
      </div>

      <div className="border-t border-primary-foreground/15 px-5 py-6 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 text-xs text-primary-foreground/70 sm:flex-row text-center sm:text-left">
          <div>
            <p className="font-serif text-sm tracking-wide text-primary-foreground">
              SOLIDERMA <span className="text-[color:var(--gold)] font-sans font-normal">Elevated Herbal Wound Science</span>
            </p>
            <p className="mt-0.5 text-[11px] text-primary-foreground/60">
              ©️ {new Date().getFullYear()} Vallalaar Remedies | All Rights Reserved
            </p>
          </div>
          <div className="sm:text-right text-[11px] text-primary-foreground/60">
            <p>Manufactured by KNISS Laboratories (P) Ltd. (Mfg. Lic. No.: 1055)</p>
            <p className="mt-0.5 font-medium text-[color:var(--gold)]/90">
              Ayurvedic Proprietary Medicine | External Use Only
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

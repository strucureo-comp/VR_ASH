import { Link } from "@tanstack/react-router";
import { Menu, X, ShoppingBag, UserRound } from "lucide-react";
import { useState } from "react";
import { Logo } from "./Logo";
import { NAV } from "@/lib/site";
import { useCart } from "./CartProvider";

/**
 * One control for both states rather than a "Sign in" that flips to "Account":
 * knowing which to show would mean an authenticated round trip on every page
 * view, and `/account` already renders the profile or the sign-in prompt
 * depending on the session.
 */
function AccountButton({
  onClick,
  label = false,
  className = "",
}: {
  onClick?: () => void;
  label?: boolean;
  className?: string;
}) {
  return (
    <Link
      to="/account"
      onClick={onClick}
      aria-label="Your account"
      className={`inline-flex items-center justify-center gap-2 rounded-full border border-border text-muted-foreground transition-colors hover:border-[color:var(--gold)] hover:text-primary ${className}`}
    >
      <UserRound className="h-4 w-4" />
      {label ? <span className="text-sm">Account</span> : null}
    </Link>
  );
}

function CartButton({ onClick, className = "" }: { onClick?: () => void; className?: string }) {
  const { count } = useCart();
  return (
    <Link
      to="/cart"
      onClick={onClick}
      aria-label={`Cart, ${count} item${count === 1 ? "" : "s"}`}
      className={`relative inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-[color:var(--botanical-deep)] ${className}`}
    >
      <ShoppingBag className="h-4 w-4" />
      Cart
      {count > 0 && (
        <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[color:var(--gold)] px-1.5 text-[11px] font-bold text-[color:var(--botanical-deep)]">
          {count}
        </span>
      )}
    </Link>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50">
      <div className="bg-[color:var(--botanical-deep)] px-4 py-2 text-center text-[9px] leading-tight tracking-[0.1em] text-primary-foreground uppercase sm:text-[11px] sm:tracking-[0.18em]">
        Ayurvedic Proprietary Medicine · Chennai, India
      </div>
      <div className="border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
          <Link to="/" onClick={() => setOpen(false)}>
            <Logo />
          </Link>
          <nav className="hidden items-center gap-5 lg:flex xl:gap-7">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.to === "/" }}
                className="whitespace-nowrap text-[13px] text-muted-foreground transition-colors hover:text-primary xl:text-sm [&.active]:text-primary"
              >
                {item.label}
              </Link>
            ))}
            <AccountButton label className="h-9 shrink-0 px-4" />
            <CartButton className="shrink-0" />
          </nav>
          <div className="flex items-center gap-2 lg:hidden">
            <CartButton onClick={() => setOpen(false)} className="px-3.5 py-2 text-xs" />
            <button
              type="button"
              aria-label="Toggle menu"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="-mr-1 inline-flex h-11 w-11 items-center justify-center"
            >
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
        {open && (
          <nav className="flex flex-col border-t border-border px-4 py-2 sm:px-6 lg:hidden">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.to === "/" }}
                onClick={() => setOpen(false)}
                className="border-b border-border/60 py-3 text-sm text-foreground [&.active]:text-primary"
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-3 pb-2">
              <AccountButton
                label
                onClick={() => setOpen(false)}
                className="h-10 w-full justify-center px-4"
              />
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}

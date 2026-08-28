import { Link } from "@tanstack/react-router";
import { Menu, X, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { Logo } from "./Logo";
import { NAV } from "@/lib/site";
import { useCart } from "./CartProvider";

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
      <div className="bg-[color:var(--botanical-deep)] py-2 text-center text-[11px] tracking-[0.18em] text-primary-foreground uppercase">
        Ayurvedic Proprietary Medicine · Chennai, India
      </div>
      <div className="border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
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
            <CartButton className="shrink-0" />
          </nav>
          <div className="flex items-center gap-3 lg:hidden">
            <CartButton onClick={() => setOpen(false)} className="px-4 py-1.5 text-xs" />
            <button aria-label="Toggle menu" onClick={() => setOpen((v) => !v)}>
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
        {open && (
          <nav className="flex flex-col border-t border-border px-6 py-3 lg:hidden">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.to === "/" }}
                onClick={() => setOpen(false)}
                className="py-2.5 text-sm text-foreground [&.active]:text-primary"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}

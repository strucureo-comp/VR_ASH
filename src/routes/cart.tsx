import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { Reveal } from "@/components/site/Reveal";
import { useCart } from "@/components/site/CartProvider";
import { whatsappLink } from "@/lib/site";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart & Order Details | Vallalaar Remedies" },
      {
        name: "description",
        content:
          "Review the Soliderma products in your cart and share your name, email, WhatsApp number and delivery address to place an order enquiry.",
      },
      { property: "og:title", content: "Your Cart | Vallalaar Remedies" },
      {
        property: "og:description",
        content: "Complete your Soliderma order details and send them to our team on WhatsApp.",
      },
    ],
  }),
  component: CartPage,
});

const orderSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name").max(100),
  email: z.string().trim().email("Please enter a valid email address").max(255),
  phone: z
    .string()
    .trim()
    .min(8, "Please enter your WhatsApp number with country code")
    .max(20)
    .regex(/^[+0-9\s-]+$/, "Only digits, spaces, + and - are allowed"),
  address: z.string().trim().min(12, "Please enter a complete delivery address").max(500),
  notes: z.string().trim().max(500).optional(),
});

type FieldErrors = Partial<Record<keyof z.infer<typeof orderSchema>, string>>;

function CartPage() {
  const { items, count, setQty, remove, clear } = useCart();
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", notes: "" });
  const [errors, setErrors] = useState<FieldErrors>({});

  const update = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.error("Your cart is empty", { description: "Add a product before placing an order." });
      return;
    }
    const parsed = orderSchema.safeParse(form);
    if (!parsed.success) {
      const next: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof FieldErrors;
        if (key && !next[key]) next[key] = issue.message;
      }
      setErrors(next);
      toast.error("Please check the highlighted fields");
      return;
    }

    const d = parsed.data;
    const lines = [
      "New order enquiry — Vallalaar Remedies",
      "",
      "Products selected:",
      ...items.map((i) => `• ${i.name} ${i.size} × ${i.qty}`),
      "",
      `Name: ${d.name}`,
      `Email: ${d.email}`,
      `WhatsApp: ${d.phone}`,
      `Address: ${d.address}`,
    ];
    if (d.notes) lines.push(`Notes: ${d.notes}`);

    window.open(whatsappLink(lines.join("\n")), "_blank", "noopener,noreferrer");
    toast.success("Order details ready on WhatsApp", {
      description: "Send the prefilled message to confirm your order.",
    });
    clear();
    setForm({ name: "", email: "", phone: "", address: "", notes: "" });
  };

  const field =
    "mt-2 w-full rounded-md border border-input bg-card px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary";

  return (
    <>
      <section className="border-b border-border bg-[color:var(--surface)] px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <p className="eyebrow text-[color:var(--gold)]">Order</p>
          <h1 className="mt-4 text-4xl text-foreground sm:text-5xl">Your Cart</h1>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
            Add the products you need, then share your details. We confirm availability, pricing and
            delivery over WhatsApp.
          </p>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-14 px-6 py-16 lg:grid-cols-[1fr_1fr]">
        {/* CART ITEMS */}
        <Reveal>
          <h2 className="text-2xl text-foreground">
            Selected Products{count > 0 ? ` (${count})` : ""}
          </h2>

          {items.length === 0 ? (
            <div className="mt-6 rounded-lg border border-dashed border-border p-10 text-center">
              <ShoppingBag className="mx-auto h-7 w-7 text-muted-foreground" />
              <p className="mt-4 text-sm text-muted-foreground">Your cart is empty.</p>
              <Link
                to="/soliderma"
                className="mt-5 inline-flex rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground"
              >
                Browse products
              </Link>
            </div>
          ) : (
            <ul className="mt-6 divide-y divide-border border-y border-border">
              {items.map((i) => (
                <li key={i.id} className="flex items-center justify-between gap-4 py-5">
                  <div>
                    <p className="text-lg text-foreground">{i.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{i.size}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center rounded-full border border-border">
                      <button
                        type="button"
                        aria-label={`Decrease ${i.name} ${i.size}`}
                        onClick={() => setQty(i.id, i.qty - 1)}
                        className="px-3 py-2 text-muted-foreground hover:text-primary"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="min-w-6 text-center text-sm text-foreground">{i.qty}</span>
                      <button
                        type="button"
                        aria-label={`Increase ${i.name} ${i.size}`}
                        onClick={() => setQty(i.id, i.qty + 1)}
                        className="px-3 py-2 text-muted-foreground hover:text-primary"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <button
                      type="button"
                      aria-label={`Remove ${i.name} ${i.size}`}
                      onClick={() => remove(i.id)}
                      className="text-muted-foreground transition-colors hover:text-[color:var(--burgundy)]"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
            Pricing is shared on confirmation. Soliderma is an Ayurvedic proprietary medicine — please
            follow professional medical guidance for serious wounds.
          </p>
        </Reveal>

        {/* DETAILS FORM */}
        <Reveal delay={0.1}>
          <form onSubmit={submit} noValidate className="rounded-lg border border-border bg-card p-8">
            <h2 className="text-2xl text-foreground">Your Details</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              We use these details only to process and deliver your order.
            </p>

            <div className="mt-7 space-y-5">
              <div>
                <label htmlFor="name" className="eyebrow text-muted-foreground">
                  Full name
                </label>
                <input id="name" value={form.name} onChange={update("name")} maxLength={100} className={field} placeholder="Your name" />
                {errors.name && <p className="mt-1.5 text-xs text-[color:var(--burgundy)]">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="email" className="eyebrow text-muted-foreground">
                  Email
                </label>
                <input id="email" type="email" value={form.email} onChange={update("email")} maxLength={255} className={field} placeholder="you@example.com" />
                {errors.email && <p className="mt-1.5 text-xs text-[color:var(--burgundy)]">{errors.email}</p>}
              </div>
              <div>
                <label htmlFor="phone" className="eyebrow text-muted-foreground">
                  WhatsApp number
                </label>
                <input id="phone" type="tel" value={form.phone} onChange={update("phone")} maxLength={20} className={field} placeholder="+91 90000 00000" />
                {errors.phone && <p className="mt-1.5 text-xs text-[color:var(--burgundy)]">{errors.phone}</p>}
              </div>
              <div>
                <label htmlFor="address" className="eyebrow text-muted-foreground">
                  Delivery address
                </label>
                <textarea id="address" rows={3} value={form.address} onChange={update("address")} maxLength={500} className={field} placeholder="House / street, area, city, state, PIN code" />
                {errors.address && <p className="mt-1.5 text-xs text-[color:var(--burgundy)]">{errors.address}</p>}
              </div>
              <div>
                <label htmlFor="notes" className="eyebrow text-muted-foreground">
                  Notes (optional)
                </label>
                <textarea id="notes" rows={2} value={form.notes} onChange={update("notes")} maxLength={500} className={field} placeholder="Anything we should know" />
              </div>
            </div>

            <button
              type="submit"
              className="mt-8 w-full rounded-full bg-[color:var(--burgundy)] px-7 py-3.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Place order on WhatsApp
            </button>
            <p className="mt-3 text-center text-[11px] text-muted-foreground">
              Your cart and details open as a prefilled WhatsApp message to our team.
            </p>
          </form>
        </Reveal>
      </div>
    </>
  );
}

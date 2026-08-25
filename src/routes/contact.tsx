import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { WA_ORDER } from "@/lib/site";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Vallalaar Remedies | Soliderma Enquiries, Chennai" },
      {
        name: "description",
        content:
          "Contact Vallalaar Remedies in T. Nagar, Chennai for Soliderma product, clinic, bulk and distributor enquiries. Phone 94458 48148.",
      },
      { property: "og:title", content: "Let's Talk About Better Wound Care" },
      {
        property: "og:description",
        content: "Customers, healthcare professionals, clinics and distributors are welcome to reach out.",
      },
    ],
  }),
  component: Contact,
});

const ENQUIRIES = [
  "Product Enquiries",
  "Clinic & Doctor Enquiries",
  "Bulk Orders",
  "Distributor Enquiries",
  "General Enquiries",
];

function Contact() {
  const [sent, setSent] = useState(false);

  return (
    <>
      <section className="bg-[color:var(--botanical-deep)] px-6 pb-40 pt-20 text-primary-foreground">
        <div className="mx-auto max-w-4xl">
          <p className="eyebrow text-[color:var(--gold)]">19 &nbsp;·&nbsp; Contact</p>
          <h1 className="mt-5 text-5xl">Let&rsquo;s Talk About Better Wound Care.</h1>
          <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-primary-foreground/75">
            Whether you&rsquo;re a customer, healthcare professional, clinic or distributor, we&rsquo;d
            love to hear from you.
          </p>
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="mx-auto -mt-28 grid max-w-5xl gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
              toast.success("Thank you — your enquiry has been sent.");
            }}
            className="rounded-lg border border-border bg-card p-8 shadow-xl sm:p-10"
          >
            <h2 className="font-display text-2xl text-foreground">Send an Enquiry</h2>
            <div className="mt-6 space-y-5">
              <div>
                <Label htmlFor="name">
                  Name <span className="text-[color:var(--burgundy)]">*</span>
                </Label>
                <Input id="name" required placeholder="Your name" className="mt-2" />
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" type="tel" placeholder="94458 48148" className="mt-2" />
                </div>
                <div>
                  <Label htmlFor="email">
                    Email <span className="text-[color:var(--burgundy)]">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    placeholder="email@example.com"
                    className="mt-2"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="message">
                  Message <span className="text-[color:var(--burgundy)]">*</span>
                </Label>
                <Textarea
                  id="message"
                  required
                  rows={6}
                  placeholder="Tell us about your enquiry"
                  className="mt-2"
                />
              </div>
            </div>
            <Button type="submit" size="lg" className="mt-8 rounded-full px-8">
              {sent ? "Sent" : "Send an Enquiry"}
            </Button>
          </form>

          <div className="rounded-lg border border-border bg-[color:var(--surface)] p-8">
            <h2 className="font-display text-2xl text-foreground">Vallalaar Remedies</h2>
            <p className="mt-5 flex gap-3 text-sm leading-relaxed text-muted-foreground">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--botanical)]" />
              <span>
                25/5, Nathamuni Street,
                <br />
                T. Nagar, Chennai &ndash; 600 017.
              </span>
            </p>
            <a
              href="tel:+919445848148"
              className="mt-4 flex items-center gap-3 text-sm text-foreground"
            >
              <Phone className="h-4 w-4 text-[color:var(--botanical)]" /> 94458 48148
            </a>

            <h3 className="eyebrow mt-9 text-muted-foreground">Enquiries</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {ENQUIRIES.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>

            <a
              href={WA_ORDER}
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-block rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

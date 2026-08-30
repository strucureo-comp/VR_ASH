import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Check, MapPin, MessageCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitEnquiry } from "@/lib/content/api";
import { contactFormSchema } from "@/lib/content/schema";
import type { ContactForm } from "@/lib/content/types";
import { WA_ENQUIRY, whatsappLink } from "@/lib/site";

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
        content:
          "Customers, healthcare professionals, clinics and distributors are welcome to reach out.",
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

const EMPTY: ContactForm = { name: "", email: "", phone: "", message: "", honeypot: "" };

/**
 * The enquiry is saved to the database first and WhatsApp is offered afterwards.
 * The other way round loses the enquiry whenever somebody closes WhatsApp without
 * sending, which is what this page used to do with every submission.
 */
function Contact() {
  const [sent, setSent] = useState<ContactForm | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactForm>({ resolver: zodResolver(contactFormSchema), defaultValues: EMPTY });

  const send = useMutation({
    mutationFn: async (values: ContactForm) =>
      submitEnquiry({
        data: {
          kind: "contact",
          name: values.name,
          email: values.email,
          phone: values.phone,
          message: values.message,
          product: "",
          honeypot: values.honeypot,
        },
      }),
    onSuccess: (result, values) => {
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      setSent(values);
      toast.success("Thank you — your enquiry has reached us.");
    },
    // A failed write must not look like a sent enquiry, so the form stays put and
    // the two channels beside it become the way through.
    onError: () => {
      toast.error("We could not save your enquiry just now.", {
        description: "Please try WhatsApp or the phone number beside this form.",
      });
    },
  });

  return (
    <>
      <section className="bg-[color:var(--botanical-deep)] px-5 pb-32 pt-12 text-primary-foreground sm:px-6 sm:pb-40 sm:pt-20">
        <div className="mx-auto max-w-4xl">
          <p className="eyebrow text-[color:var(--gold)]">Contact</p>
          <h1 className="mt-4 text-[2rem] leading-tight sm:mt-5 sm:text-4xl lg:text-5xl">
            Let&rsquo;s Talk About Better Wound Care.
          </h1>
          <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-primary-foreground/75">
            Whether you&rsquo;re a customer, healthcare professional, clinic or distributor,
            we&rsquo;d love to hear from you.
          </p>
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="mx-auto -mt-28 grid max-w-5xl gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          {sent ? (
            <div className="rounded-lg border border-border bg-card p-8 shadow-xl sm:p-10">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[color:var(--botanical)]/10">
                <Check className="h-5 w-5 text-[color:var(--botanical)]" />
              </span>
              <h2 className="mt-5 font-display text-2xl text-foreground">
                Thank you, {sent.name.split(" ")[0]}.
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Your enquiry is with us and we will reply to {sent.email}. If you would rather have
                an answer straight away, send the same message on WhatsApp.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href={whatsappLink(
                    `Hello Vallalaar Remedies, this is ${sent.name}. ${sent.message}`,
                  )}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-12 items-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors sm:hover:bg-[color:var(--botanical-deep)]"
                >
                  <MessageCircle className="h-4 w-4" />
                  Continue on WhatsApp
                </a>
                <button
                  type="button"
                  onClick={() => setSent(null)}
                  className="inline-flex min-h-12 items-center rounded-full border border-border px-6 text-sm text-muted-foreground transition-colors sm:hover:border-[color:var(--gold)] sm:hover:text-primary"
                >
                  Send another enquiry
                </button>
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit((values) => send.mutate(values))}
              noValidate
              className="rounded-lg border border-border bg-card p-8 shadow-xl sm:p-10"
            >
              <h2 className="font-display text-2xl text-foreground">Send an Enquiry</h2>
              <div className="mt-6 space-y-5">
                <div>
                  <Label htmlFor="name">
                    Name <span className="text-[color:var(--burgundy)]">*</span>
                  </Label>
                  <Input
                    id="name"
                    autoComplete="name"
                    placeholder="Your name"
                    className="mt-2"
                    aria-invalid={errors.name ? true : undefined}
                    {...register("name")}
                  />
                  <FieldError message={errors.name?.message} />
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      autoComplete="tel"
                      placeholder="94458 48148"
                      className="mt-2"
                      aria-invalid={errors.phone ? true : undefined}
                      {...register("phone")}
                    />
                    <FieldError message={errors.phone?.message} />
                  </div>
                  <div>
                    <Label htmlFor="email">
                      Email <span className="text-[color:var(--burgundy)]">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder="email@example.com"
                      className="mt-2"
                      aria-invalid={errors.email ? true : undefined}
                      {...register("email")}
                    />
                    <FieldError message={errors.email?.message} />
                  </div>
                </div>
                <div>
                  <Label htmlFor="message">
                    Message <span className="text-[color:var(--burgundy)]">*</span>
                  </Label>
                  <Textarea
                    id="message"
                    rows={6}
                    placeholder="Tell us about your enquiry"
                    className="mt-2"
                    aria-invalid={errors.message ? true : undefined}
                    {...register("message")}
                  />
                  <FieldError message={errors.message?.message} />
                </div>
                {/* Left empty by a person, filled by most bots. A filled one is
                    answered with success and dropped server-side. */}
                <div className="hidden" aria-hidden="true">
                  <label htmlFor="company">Company</label>
                  <input id="company" tabIndex={-1} autoComplete="off" {...register("honeypot")} />
                </div>
              </div>
              <Button
                type="submit"
                size="lg"
                disabled={send.isPending}
                className="mt-8 rounded-full px-8"
              >
                {send.isPending ? "Sending…" : "Send an Enquiry"}
              </Button>
            </form>
          )}

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
              href={WA_ENQUIRY}
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

function FieldError({ message }: { message?: string | undefined }) {
  if (!message) return null;
  return (
    <p role="alert" className="mt-1.5 text-xs text-[color:var(--burgundy)]">
      {message}
    </p>
  );
}

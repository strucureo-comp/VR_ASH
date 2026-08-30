import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { BellRing, Check, Mail, MessageCircle, Phone } from "lucide-react";
import { toast } from "sonner";

import { AdminShell } from "@/components/admin/AdminShell";
import { readEnquiries, setEnquiryHandled } from "@/lib/admin/db";
import { useAdminSession } from "@/lib/admin/useAdminSession";
import { firebaseConfigQuery } from "@/lib/content/queryOptions";
import type { EnquiryRecord } from "@/lib/content/types";

/**
 * The inbox for `/contact` and the "notify me" capture.
 *
 * This is the one read that goes through the browser SDK rather than a server
 * function: the rules require an allowlisted UID to see `enquiries`, and that UID
 * only exists in the signed-in browser. The storefront never reads this path.
 */
export const Route = createFileRoute("/admin/enquiries")({
  loader: async ({ context }) => ({
    config: await context.queryClient.ensureQueryData(firebaseConfigQuery()),
  }),
  head: () => ({
    meta: [{ title: "Enquiries | Admin" }, { name: "robots", content: "noindex, nofollow" }],
  }),
  component: Enquiries,
});

function Enquiries() {
  const { config } = Route.useLoaderData();
  const session = useAdminSession(config);
  const queryClient = useQueryClient();
  const { sdk } = session;

  const inbox = useQuery({
    queryKey: ["admin", "enquiries"],
    queryFn: async () => (sdk ? readEnquiries(sdk) : []),
    enabled: session.status === "ready" && sdk !== null,
  });

  const mark = useMutation({
    mutationFn: async ({ id, handled }: { id: string; handled: boolean }) => {
      if (!sdk) return;
      await setEnquiryHandled(sdk, id, handled);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "enquiries"] }),
    onError: (cause: unknown) =>
      toast.error(cause instanceof Error ? cause.message : "Could not update that enquiry."),
  });

  const enquiries = inbox.data ?? [];
  const open = enquiries.filter((enquiry) => !enquiry.handled).length;

  return (
    <AdminShell
      session={session}
      heading="Enquiries"
      intro={
        open === 0
          ? "Everything from the contact form and the notify-me capture."
          : `${open} still to answer.`
      }
    >
      {inbox.isPending && session.status === "ready" ? (
        <div className="h-24 animate-pulse rounded-xl border border-border bg-card" />
      ) : null}

      {inbox.isError ? (
        <p
          role="alert"
          className="rounded-xl border border-[color:var(--burgundy)]/30 bg-card p-6 text-sm text-[color:var(--burgundy)]"
        >
          Could not read the enquiries. That is what a rules rejection looks like — check that this
          account is still listed under <code>admins</code>.
        </p>
      ) : null}

      {inbox.isSuccess && enquiries.length === 0 ? (
        <p className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
          Nothing yet. Enquiries from <code>/contact</code> and from the notify-me form land here.
        </p>
      ) : null}

      <ul className="space-y-3">
        {enquiries.map((enquiry) => (
          <li key={enquiry.id}>
            <EnquiryCard
              enquiry={enquiry}
              busy={mark.isPending}
              onToggle={() => mark.mutate({ id: enquiry.id, handled: !enquiry.handled })}
            />
          </li>
        ))}
      </ul>
    </AdminShell>
  );
}

const WHEN = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  hour: "numeric",
  minute: "2-digit",
  timeZone: "Asia/Kolkata",
});

/**
 * A reply link to the enquirer's own WhatsApp, not the business number.
 *
 * Numbers are typed by hand into a free-text field, so a ten-digit local number is
 * assumed Indian and anything shorter is treated as unusable rather than guessed at.
 */
function waReply(phone: string): string | null {
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 10) return null;
  return `https://wa.me/${digits.length === 10 ? `91${digits}` : digits}`;
}

function EnquiryCard({
  enquiry,
  busy,
  onToggle,
}: {
  enquiry: EnquiryRecord;
  busy: boolean;
  onToggle: () => void;
}) {
  const whatsapp = waReply(enquiry.phone);
  const subject = enquiry.product
    ? `Re: your enquiry about ${enquiry.product}`
    : "Re: your enquiry — Vallalaar Remedies";

  return (
    <article
      className={`rounded-xl border bg-card p-5 ${
        enquiry.handled ? "border-border opacity-70" : "border-[color:var(--gold)]/40"
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <span className="flex items-center gap-2">
            {enquiry.kind === "notify" ? (
              <BellRing className="h-4 w-4 shrink-0 text-[color:var(--gold)]" />
            ) : (
              <Mail className="h-4 w-4 shrink-0 text-[color:var(--botanical)]" />
            )}
            <span className="truncate text-[15px] text-foreground">
              {enquiry.name || "No name given"}
            </span>
          </span>
          <span className="mt-1 block text-xs text-muted-foreground">
            {enquiry.createdAt ? WHEN.format(new Date(enquiry.createdAt)) : "date unknown"}
            {enquiry.product ? ` · ${enquiry.product}` : ""}
          </span>
        </div>
        <button
          type="button"
          disabled={busy}
          onClick={onToggle}
          className="inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-full border border-border px-4 text-xs text-muted-foreground transition-colors disabled:opacity-50 sm:hover:border-[color:var(--gold)] sm:hover:text-primary"
        >
          <Check className="h-3.5 w-3.5" />
          {enquiry.handled ? "Handled" : "Mark handled"}
        </button>
      </div>

      {enquiry.message ? (
        <p className="mt-4 text-sm leading-relaxed whitespace-pre-line text-muted-foreground">
          {enquiry.message}
        </p>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-4">
        {enquiry.email ? (
          <a
            href={`mailto:${enquiry.email}?subject=${encodeURIComponent(subject)}`}
            className="inline-flex min-h-10 items-center gap-1.5 rounded-full bg-[color:var(--surface)] px-4 text-xs text-foreground transition-colors sm:hover:text-primary"
          >
            <Mail className="h-3.5 w-3.5" />
            {enquiry.email}
          </a>
        ) : null}
        {enquiry.phone ? (
          <a
            href={`tel:${enquiry.phone.replace(/\s/g, "")}`}
            className="inline-flex min-h-10 items-center gap-1.5 rounded-full bg-[color:var(--surface)] px-4 text-xs text-foreground transition-colors sm:hover:text-primary"
          >
            <Phone className="h-3.5 w-3.5" />
            {enquiry.phone}
          </a>
        ) : null}
        {whatsapp ? (
          <a
            href={whatsapp}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-10 items-center gap-1.5 rounded-full bg-[color:var(--surface)] px-4 text-xs text-foreground transition-colors sm:hover:text-primary"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            WhatsApp
          </a>
        ) : null}
      </div>
    </article>
  );
}

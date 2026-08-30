import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { BellRing, Check, MessageCircle } from "lucide-react";
import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import { submitEnquiry } from "@/lib/content/api";
import { notifyFormSchema } from "@/lib/content/schema";
import type { NotifyForm } from "@/lib/content/types";
import { waNotify } from "@/lib/site";

/**
 * The waiting list for a product that has not launched.
 *
 * It used to be a WhatsApp link and nothing else, so an interested visitor left no
 * trace unless they finished sending the message. Now the address is recorded first
 * and WhatsApp stays underneath as the faster route for whoever prefers it.
 */
export function NotifyMe({
  productName,
  className = "",
}: {
  productName: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  // A product title can hold spaces and a ™, neither of which belongs in an id.
  const fieldId = useId();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NotifyForm>({
    resolver: zodResolver(notifyFormSchema),
    defaultValues: { email: "", honeypot: "" },
  });

  const join = useMutation({
    mutationFn: async (values: NotifyForm) =>
      submitEnquiry({
        data: {
          kind: "notify",
          name: "",
          email: values.email,
          phone: "",
          message: "",
          product: productName,
          honeypot: values.honeypot,
        },
      }),
    onSuccess: (result) => {
      if (result.ok) setDone(true);
    },
  });

  if (done) {
    return (
      <div className={className}>
        <p className="inline-flex items-center gap-2 text-sm text-[color:var(--botanical)]">
          <Check className="h-4 w-4" />
          We will email you when {productName} is available.
        </p>
      </div>
    );
  }

  return (
    <div className={className}>
      {open ? (
        <form onSubmit={handleSubmit((values) => join.mutate(values))} noValidate>
          <div className="flex flex-wrap items-center gap-2">
            <label htmlFor={fieldId} className="sr-only">
              Email address
            </label>
            <input
              id={fieldId}
              type="email"
              autoComplete="email"
              placeholder="email@example.com"
              aria-invalid={errors.email ? true : undefined}
              className="min-h-10 flex-1 rounded-full border border-input bg-transparent px-4 text-sm shadow-sm focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
              {...register("email")}
            />
            <button
              type="submit"
              disabled={join.isPending}
              className="inline-flex min-h-10 items-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors disabled:opacity-55 sm:hover:bg-[color:var(--botanical-deep)]"
            >
              {join.isPending ? "Saving…" : "Notify me"}
            </button>
            {/* Bots fill this; people never see it. */}
            <div className="hidden" aria-hidden="true">
              <input tabIndex={-1} autoComplete="off" {...register("honeypot")} />
            </div>
          </div>
          {errors.email?.message ? (
            <p role="alert" className="mt-1.5 text-xs text-[color:var(--burgundy)]">
              {errors.email.message}
            </p>
          ) : null}
          {join.isError ? (
            <p role="alert" className="mt-1.5 text-xs text-[color:var(--burgundy)]">
              That did not save. Please use WhatsApp below.
            </p>
          ) : null}
          <a
            href={waNotify(productName)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2.5 inline-flex items-center gap-1.5 text-xs text-muted-foreground underline-offset-4 sm:hover:text-[color:var(--botanical)] sm:hover:underline"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            Ask on WhatsApp instead
          </a>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex min-h-10 items-center gap-2 rounded-full border border-border px-5 text-sm font-medium text-muted-foreground transition-colors sm:hover:border-[color:var(--botanical)] sm:hover:text-[color:var(--botanical)]"
        >
          <BellRing className="h-4 w-4" />
          Notify Me
        </button>
      )}
    </div>
  );
}

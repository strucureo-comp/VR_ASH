import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";

import { AdminShell } from "@/components/admin/AdminShell";
import { Field, IconSelect, Row, Rows } from "@/components/admin/Fields";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { writeSharedContent } from "@/lib/admin/db";
import { seedSharedContent } from "@/lib/admin/seed";
import { useAdminSession } from "@/lib/admin/useAdminSession";
import { FALLBACK_ICON_NAME, ICON_NAMES } from "@/lib/content/icons";
import { firebaseConfigQuery, sharedContentQuery } from "@/lib/content/queryOptions";
import { sharedContentFormSchema } from "@/lib/content/schema";
import type { SharedContent, SharedContentForm } from "@/lib/content/types";

/**
 * The two blocks that are not about one product: certifications (the home strip,
 * /certifications and the metrics count) and the site-wide FAQ.
 *
 * Reached from a card on the Products page rather than a third tab — the panel was
 * asked for with two sections and it has two.
 */
export const Route = createFileRoute("/admin/shared")({
  loader: async ({ context }) => ({
    config: await context.queryClient.ensureQueryData(firebaseConfigQuery()),
    content: await context.queryClient.ensureQueryData(sharedContentQuery()),
  }),
  head: () => ({
    meta: [{ title: "Shared content | Admin" }, { name: "robots", content: "noindex, nofollow" }],
  }),
  component: SharedEditor,
});

const EMPTY: SharedContentForm = { certifications: [], faqs: [] };

function toForm(content: SharedContent | null): SharedContentForm {
  if (!content) return EMPTY;
  return { certifications: content.certifications, faqs: content.faqs };
}

function SharedEditor() {
  const { config, content } = Route.useLoaderData();
  const session = useAdminSession(config);
  const queryClient = useQueryClient();

  const { control, register, handleSubmit, reset, formState } = useForm<SharedContentForm>({
    resolver: zodResolver(sharedContentFormSchema),
    defaultValues: toForm(content),
  });
  const { errors, isDirty, isSubmitting } = formState;

  const certifications = useFieldArray({ control, name: "certifications" });
  const faqs = useFieldArray({ control, name: "faqs" });

  const onSubmit = handleSubmit(async (values) => {
    if (!session.sdk) return;
    try {
      await writeSharedContent(session.sdk, values);
      await queryClient.invalidateQueries({ queryKey: ["content", "shared"] });
      reset(values);
      toast.success("Saved.");
    } catch (cause) {
      toast.error(cause instanceof Error ? cause.message : "Could not save.");
    }
  });

  return (
    <AdminShell
      session={session}
      heading="Shared content"
      intro="Certifications and the site-wide FAQ."
    >
      <Link
        to="/admin"
        className="inline-flex min-h-10 items-center gap-1.5 text-sm text-muted-foreground transition-colors sm:hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        All products
      </Link>

      {!content ? (
        <div className="mt-4 rounded-xl border border-[color:var(--gold)]/40 bg-card p-5">
          <p className="text-sm leading-relaxed text-muted-foreground">
            Nothing saved yet. The certifications and FAQ currently hard-coded in the site can be
            loaded into the form as a starting point — nothing is written until you save.
          </p>
          <button
            type="button"
            onClick={() => reset(seedSharedContent(), { keepDefaultValues: true })}
            className="mt-4 inline-flex min-h-10 items-center rounded-full border border-border px-4 text-sm text-muted-foreground transition-colors sm:hover:border-[color:var(--gold)] sm:hover:text-primary"
          >
            Seed from current site content
          </button>
        </div>
      ) : null}

      <form onSubmit={onSubmit} className="mt-6 space-y-6">
        <Rows
          title="Certifications"
          hint="The home-page strip, /certifications, and the certification count in the metrics bar all read this list."
          count={certifications.fields.length}
          onAdd={() => certifications.append({ icon: FALLBACK_ICON_NAME, title: "", body: "" })}
          addLabel="Add certification"
        >
          {certifications.fields.map((field, index) => (
            <Row
              key={field.id}
              index={index}
              count={certifications.fields.length}
              onMove={certifications.move}
              onRemove={certifications.remove}
            >
              <div className="grid gap-3 sm:grid-cols-[12rem_1fr]">
                <Field
                  id={`certifications.${index}.icon`}
                  label="Icon"
                  error={errors.certifications?.[index]?.icon?.message}
                >
                  <IconSelect
                    id={`certifications.${index}.icon`}
                    names={ICON_NAMES}
                    {...register(`certifications.${index}.icon`)}
                  />
                </Field>
                <Field
                  id={`certifications.${index}.title`}
                  label="Title"
                  error={errors.certifications?.[index]?.title?.message}
                >
                  <Input
                    id={`certifications.${index}.title`}
                    className="min-h-10"
                    {...register(`certifications.${index}.title`)}
                  />
                </Field>
              </div>
              <Field
                id={`certifications.${index}.body`}
                label="Body"
                error={errors.certifications?.[index]?.body?.message}
              >
                <Textarea
                  id={`certifications.${index}.body`}
                  rows={3}
                  {...register(`certifications.${index}.body`)}
                />
              </Field>
            </Row>
          ))}
        </Rows>

        <Rows
          title="Site-wide FAQ"
          hint="Shown on /faq, in the order listed here."
          count={faqs.fields.length}
          onAdd={() => faqs.append({ q: "", a: "" })}
          addLabel="Add question"
        >
          {faqs.fields.map((field, index) => (
            <Row
              key={field.id}
              index={index}
              count={faqs.fields.length}
              onMove={faqs.move}
              onRemove={faqs.remove}
            >
              <Field
                id={`faqs.${index}.q`}
                label="Question"
                error={errors.faqs?.[index]?.q?.message}
              >
                <Input
                  id={`faqs.${index}.q`}
                  className="min-h-10"
                  {...register(`faqs.${index}.q`)}
                />
              </Field>
              <Field id={`faqs.${index}.a`} label="Answer" error={errors.faqs?.[index]?.a?.message}>
                <Textarea id={`faqs.${index}.a`} rows={4} {...register(`faqs.${index}.a`)} />
              </Field>
            </Row>
          ))}
        </Rows>

        <div className="sticky bottom-0 -mx-5 flex items-center gap-4 border-t border-border bg-[color:var(--surface)]/95 px-5 py-4 backdrop-blur sm:-mx-6 sm:px-6">
          <button
            type="submit"
            disabled={isSubmitting || session.status !== "ready"}
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-8 text-sm font-medium text-primary-foreground transition-colors disabled:opacity-50 sm:hover:bg-[color:var(--botanical-deep)]"
          >
            {isSubmitting ? "Saving…" : "Save"}
          </button>
          <span className="text-xs text-muted-foreground">
            {isDirty ? "Unsaved changes" : content ? "Up to date" : "Nothing saved yet"}
          </span>
        </div>
      </form>
    </AdminShell>
  );
}

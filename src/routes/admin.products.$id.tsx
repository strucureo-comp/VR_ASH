import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";

import { AdminShell } from "@/components/admin/AdminShell";
import { Field, IconSelect, Panel, Row, Rows } from "@/components/admin/Fields";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { writeProductContent } from "@/lib/admin/db";
import { seedProductContent } from "@/lib/admin/seed";
import { useAdminSession } from "@/lib/admin/useAdminSession";
import { FALLBACK_ICON_NAME, ICON_NAMES } from "@/lib/content/icons";
import { contentId } from "@/lib/content/paths";
import { firebaseConfigQuery, productContentQuery } from "@/lib/content/queryOptions";
import { productContentFormSchema } from "@/lib/content/schema";
import type { ProductContent, ProductContentForm } from "@/lib/content/types";
import { isSolidermaHandle } from "@/lib/shopify/format";
import { productsQuery } from "@/lib/shopify/queryOptions";

/**
 * The content editor for one product.
 *
 * The route param is the numeric Shopify product id, which is also the database
 * key — the handle is still due to be renamed `soliderma™` → `soliderma`, and a
 * rename must not orphan everything written about the product.
 *
 * Saving writes the whole node at once. A field array that lost a row has to lose
 * it in the database too, and a per-field merge would quietly keep it.
 */
export const Route = createFileRoute("/admin/products/$id")({
  loader: async ({ context, params }) => {
    const [config, products, content] = await Promise.all([
      context.queryClient.ensureQueryData(firebaseConfigQuery()),
      context.queryClient.ensureQueryData(productsQuery(50)),
      context.queryClient.ensureQueryData(productContentQuery(params.id)),
    ]);

    const product = products.find((candidate) => contentId(candidate.id) === params.id);
    if (!product) throw notFound();

    return { config, product, content };
  },
  head: () => ({
    meta: [{ title: "Edit product | Admin" }, { name: "robots", content: "noindex, nofollow" }],
  }),
  component: ProductEditor,
});

const EMPTY: ProductContentForm = {
  longDescription: "",
  directions: "",
  caution: "",
  benefits: [],
  ingredients: [],
  steps: [],
  conditions: [],
  faqs: [],
};

/** Drops `updatedAt`: it is stamped on save, not edited. */
function toForm(content: ProductContent | null): ProductContentForm {
  if (!content) return EMPTY;
  return {
    longDescription: content.longDescription,
    directions: content.directions,
    caution: content.caution,
    benefits: content.benefits,
    ingredients: content.ingredients,
    steps: content.steps,
    conditions: content.conditions,
    faqs: content.faqs,
  };
}

function ProductEditor() {
  const { config, product, content } = Route.useLoaderData();
  const session = useAdminSession(config);
  const queryClient = useQueryClient();
  const id = contentId(product.id);

  const { control, register, handleSubmit, reset, formState } = useForm<ProductContentForm>({
    resolver: zodResolver(productContentFormSchema),
    defaultValues: toForm(content),
  });
  const { errors, isDirty, isSubmitting } = formState;

  const benefits = useFieldArray({ control, name: "benefits" });
  const ingredients = useFieldArray({ control, name: "ingredients" });
  const steps = useFieldArray({ control, name: "steps" });
  const conditions = useFieldArray({ control, name: "conditions" });
  const faqs = useFieldArray({ control, name: "faqs" });

  const onSubmit = handleSubmit(async (values) => {
    if (!session.sdk) return;
    try {
      await writeProductContent(session.sdk, id, values);
      // The storefront read and the "has content" badge both go stale on a save.
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["content", "product", id] }),
        queryClient.invalidateQueries({ queryKey: ["content", "index"] }),
      ]);
      reset(values);
      toast.success("Saved.");
    } catch (cause) {
      const reason = cause instanceof Error ? cause.message : "Could not save.";
      toast.error(reason);
    }
  });

  return (
    <AdminShell session={session} heading={product.title} intro={`/${product.handle}`}>
      <Link
        to="/admin"
        className="inline-flex min-h-10 items-center gap-1.5 text-sm text-muted-foreground transition-colors sm:hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        All products
      </Link>

      {!content && isSolidermaHandle(product.handle) ? (
        <div className="mt-4 rounded-xl border border-[color:var(--gold)]/40 bg-card p-5">
          <p className="text-sm leading-relaxed text-muted-foreground">
            This product has no content record yet. The copy currently hard-coded in the site can be
            loaded into the form as a starting point — nothing is written until you save.
          </p>
          <button
            type="button"
            onClick={() => reset(seedProductContent(), { keepDefaultValues: true })}
            className="mt-4 inline-flex min-h-10 items-center rounded-full border border-border px-4 text-sm text-muted-foreground transition-colors sm:hover:border-[color:var(--gold)] sm:hover:text-primary"
          >
            Seed from current site content
          </button>
        </div>
      ) : null}

      <form onSubmit={onSubmit} className="mt-6 space-y-6">
        <Panel
          title="Long description"
          hint="Leave a blank line between paragraphs. Shown on the product page; Shopify's own description is not used for this."
        >
          <Textarea id="longDescription" rows={8} {...register("longDescription")} />
          {errors.longDescription ? (
            <p role="alert" className="mt-1.5 text-xs text-[color:var(--burgundy)]">
              {errors.longDescription.message}
            </p>
          ) : null}
        </Panel>

        <Rows
          title="Key benefits"
          hint="The layout is built for four; more will wrap."
          count={benefits.fields.length}
          onAdd={() => benefits.append({ title: "", body: "" })}
          addLabel="Add benefit"
        >
          {benefits.fields.map((field, index) => (
            <Row
              key={field.id}
              index={index}
              count={benefits.fields.length}
              onMove={benefits.move}
              onRemove={benefits.remove}
            >
              <Field
                id={`benefits.${index}.title`}
                label="Title"
                error={errors.benefits?.[index]?.title?.message}
              >
                <Input
                  id={`benefits.${index}.title`}
                  className="min-h-10"
                  {...register(`benefits.${index}.title`)}
                />
              </Field>
              <Field
                id={`benefits.${index}.body`}
                label="Body"
                error={errors.benefits?.[index]?.body?.message}
              >
                <Textarea
                  id={`benefits.${index}.body`}
                  rows={3}
                  {...register(`benefits.${index}.body`)}
                />
              </Field>
            </Row>
          ))}
        </Rows>

        <Rows
          title="Ingredients"
          hint="Rendered as a table. Latin name and part are optional."
          count={ingredients.fields.length}
          onAdd={() => ingredients.append({ name: "", latin: "", part: "" })}
          addLabel="Add ingredient"
        >
          {ingredients.fields.map((field, index) => (
            <Row
              key={field.id}
              index={index}
              count={ingredients.fields.length}
              onMove={ingredients.move}
              onRemove={ingredients.remove}
            >
              <div className="grid gap-3 sm:grid-cols-3">
                <Field
                  id={`ingredients.${index}.name`}
                  label="Name"
                  error={errors.ingredients?.[index]?.name?.message}
                >
                  <Input
                    id={`ingredients.${index}.name`}
                    className="min-h-10"
                    {...register(`ingredients.${index}.name`)}
                  />
                </Field>
                <Field
                  id={`ingredients.${index}.latin`}
                  label="Latin name"
                  error={errors.ingredients?.[index]?.latin?.message}
                >
                  <Input
                    id={`ingredients.${index}.latin`}
                    className="min-h-10"
                    {...register(`ingredients.${index}.latin`)}
                  />
                </Field>
                <Field
                  id={`ingredients.${index}.part`}
                  label="Part used"
                  error={errors.ingredients?.[index]?.part?.message}
                >
                  <Input
                    id={`ingredients.${index}.part`}
                    className="min-h-10"
                    {...register(`ingredients.${index}.part`)}
                  />
                </Field>
              </div>
            </Row>
          ))}
        </Rows>

        <Rows
          title="How to use"
          hint="Numbered steps. The step label is shown as-is, so keep it short — 01, 02."
          count={steps.fields.length}
          onAdd={() =>
            steps.append({
              step: String(steps.fields.length + 1).padStart(2, "0"),
              title: "",
              body: "",
            })
          }
          addLabel="Add step"
        >
          {steps.fields.map((field, index) => (
            <Row
              key={field.id}
              index={index}
              count={steps.fields.length}
              onMove={steps.move}
              onRemove={steps.remove}
            >
              <div className="grid gap-3 sm:grid-cols-[6rem_1fr]">
                <Field
                  id={`steps.${index}.step`}
                  label="Label"
                  error={errors.steps?.[index]?.step?.message}
                >
                  <Input
                    id={`steps.${index}.step`}
                    className="min-h-10"
                    {...register(`steps.${index}.step`)}
                  />
                </Field>
                <Field
                  id={`steps.${index}.title`}
                  label="Title"
                  error={errors.steps?.[index]?.title?.message}
                >
                  <Input
                    id={`steps.${index}.title`}
                    className="min-h-10"
                    {...register(`steps.${index}.title`)}
                  />
                </Field>
              </div>
              <Field
                id={`steps.${index}.body`}
                label="Body"
                error={errors.steps?.[index]?.body?.message}
              >
                <Textarea
                  id={`steps.${index}.body`}
                  rows={3}
                  {...register(`steps.${index}.body`)}
                />
              </Field>
            </Row>
          ))}
        </Rows>

        <Rows
          title="Conditions treated"
          hint="Shown on the product page and on /wound-care. The icon is a lucide name; anything unknown falls back to a leaf."
          count={conditions.fields.length}
          onAdd={() => conditions.append({ icon: FALLBACK_ICON_NAME, title: "", body: "" })}
          addLabel="Add condition"
        >
          {conditions.fields.map((field, index) => (
            <Row
              key={field.id}
              index={index}
              count={conditions.fields.length}
              onMove={conditions.move}
              onRemove={conditions.remove}
            >
              <div className="grid gap-3 sm:grid-cols-[12rem_1fr]">
                <Field
                  id={`conditions.${index}.icon`}
                  label="Icon"
                  error={errors.conditions?.[index]?.icon?.message}
                >
                  <IconSelect
                    id={`conditions.${index}.icon`}
                    names={ICON_NAMES}
                    {...register(`conditions.${index}.icon`)}
                  />
                </Field>
                <Field
                  id={`conditions.${index}.title`}
                  label="Title"
                  error={errors.conditions?.[index]?.title?.message}
                >
                  <Input
                    id={`conditions.${index}.title`}
                    className="min-h-10"
                    {...register(`conditions.${index}.title`)}
                  />
                </Field>
              </div>
              <Field
                id={`conditions.${index}.body`}
                label="Body"
                error={errors.conditions?.[index]?.body?.message}
              >
                <Textarea
                  id={`conditions.${index}.body`}
                  rows={3}
                  {...register(`conditions.${index}.body`)}
                />
              </Field>
            </Row>
          ))}
        </Rows>

        <Rows
          title="Product FAQs"
          hint="Questions specific to this product. The site-wide FAQ page is edited under Shared content."
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

        <Panel
          title="Directions and caution"
          hint="Both are optional and each renders only when it has text."
        >
          <div className="space-y-4">
            <Field id="directions" label="Directions for use" error={errors.directions?.message}>
              <Textarea id="directions" rows={4} {...register("directions")} />
            </Field>
            <Field id="caution" label="Caution" error={errors.caution?.message}>
              <Textarea id="caution" rows={4} {...register("caution")} />
            </Field>
          </div>
        </Panel>

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

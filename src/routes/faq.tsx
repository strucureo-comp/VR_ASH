import { createFileRoute } from "@tanstack/react-router";
import { Section } from "@/components/site/Section";
import { sharedContentQuery } from "@/lib/content/queryOptions";
import { preferSaved } from "@/lib/content/render";
import { FAQS } from "@/lib/site";

export const Route = createFileRoute("/faq")({
  loader: async ({ context }) => ({
    shared: await context.queryClient.ensureQueryData(sharedContentQuery()),
  }),
  head: () => ({
    meta: [
      { title: "Soliderma FAQ | Vallalaar Remedies" },
      {
        name: "description",
        content:
          "Answers about Soliderma — what it is, where it is used, how it is applied, manufacturing, ordering and bulk clinic enquiries.",
      },
      { property: "og:title", content: "Frequently Asked Questions | Soliderma" },
      {
        property: "og:description",
        content: "Common questions about Soliderma multi action wound healing spray.",
      },
    ],
  }),
  component: Faq,
});

function Faq() {
  const { shared } = Route.useLoaderData();
  const rawFaqs = preferSaved(shared?.faqs ?? [], FAQS);
  const faqs = rawFaqs.map((f) => {
    const fallback = FAQS.find(
      (item) => item.q.toLowerCase().trim() === f.q.toLowerCase().trim(),
    );
    const clean = (str: string) => {
      let res = str.replace(/SOLIDERMA[®️®™]*/gi, "SOLIDERMA");
      if (res.includes("Healing outcomes vary by wound depth")) {
        return "Healing times depend on the depth of the wound and your overall health, but SOLIDERMA works continuously to support and speed up your body's natural healing process.";
      }
      return res;
    };
    const rawAnswer = f.a && f.a.trim().length > 0 ? f.a : (fallback?.a ?? f.a ?? "");
    return {
      q: clean(f.q),
      a: clean(rawAnswer),
    };
  });

  return (
    <>
      <section className="bg-[color:var(--surface)] px-5 py-12 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-4xl">
          <p className="eyebrow text-[color:var(--gold)]">FAQ</p>
          <h1 className="mt-4 text-[2rem] leading-tight text-foreground sm:mt-5 sm:text-4xl lg:text-5xl">
            Frequently Asked Questions
          </h1>
        </div>
      </section>
      <Section>
        <div className="mx-auto max-w-4xl">
          <div className="grid gap-6 sm:grid-cols-2">
            {faqs.map((f, i) => {
              const categories = [
                "Diabetic Patients",
                "Chronic Wounds",
                "Formula Purity",
                "Results Timeline",
                "Clinical Scope",
                "Manufacturing",
                "Certifications",
                "Institutional Supply",
              ];
              const category = categories[i] ?? "Clinical Guidance";
              return (
                <div
                  key={f.q}
                  className="flex flex-col justify-between rounded-2xl border border-border bg-card p-6 sm:p-7 shadow-sm transition-all hover:border-[color:var(--botanical)]/40 hover:shadow-md"
                >
                  <div>
                    <span className="inline-block rounded-full bg-[color:var(--botanical)]/10 px-3 py-1 text-[10.5px] font-bold uppercase tracking-wider text-[color:var(--botanical)]">
                      {category}
                    </span>
                    <h3 className="mt-3 font-serif text-lg font-semibold text-foreground">
                      {f.q}
                    </h3>
                    <div className="mt-3.5 border-t border-border/50 pt-3">
                      <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-[color:var(--gold)]">
                        Answer
                      </p>
                      <p className="text-sm leading-relaxed text-foreground/85">
                        {f.a}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Section>
    </>
  );
}

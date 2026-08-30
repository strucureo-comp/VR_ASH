import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, FileText } from "lucide-react";

import { AdminShell } from "@/components/admin/AdminShell";
import { useAdminSession } from "@/lib/admin/useAdminSession";
import { contentId } from "@/lib/content/paths";
import { contentIndexQuery, firebaseConfigQuery } from "@/lib/content/queryOptions";
import { priceRangeLabel } from "@/lib/shopify/format";
import { productsQuery } from "@/lib/shopify/queryOptions";

/**
 * Products, straight from Shopify.
 *
 * Nothing is created here: a product exists because someone added it in Shopify
 * Admin, and this list is only the way in to the copy our side holds about it. That
 * is what keeps commerce facts in one system and page copy in the other.
 */
export const Route = createFileRoute("/admin/")({
  loader: async ({ context }) => ({
    config: await context.queryClient.ensureQueryData(firebaseConfigQuery()),
    products: await context.queryClient.ensureQueryData(productsQuery(50)),
  }),
  head: () => ({
    meta: [{ title: "Products | Admin" }, { name: "robots", content: "noindex, nofollow" }],
  }),
  component: AdminProducts,
});

function AdminProducts() {
  const { config, products } = Route.useLoaderData();
  const session = useAdminSession(config);

  // Only asked for once there is someone to show it to; it is also the one read
  // that has to be fresh after a save, hence the invalidation in the editor.
  const index = useQuery({ ...contentIndexQuery(), enabled: session.status === "ready" });
  const saved = new Set(index.data ?? []);

  return (
    <AdminShell
      session={session}
      heading="Products"
      intro="Everything the site says about a product beyond its price and stock."
    >
      {products.length === 0 ? (
        <p className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
          No products came back from Shopify. Add one in Shopify Admin and it appears here.
        </p>
      ) : (
        <ul className="space-y-3">
          {products.map((product) => (
            <li key={product.id}>
              <Link
                to="/admin/products/$id"
                params={{ id: contentId(product.id) }}
                className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-colors sm:hover:border-[color:var(--gold)]"
              >
                <div className="min-w-0 flex-1">
                  <span className="block truncate text-[15px] text-foreground">
                    {product.title}
                  </span>
                  <span className="mt-1 block truncate text-xs text-muted-foreground">
                    /{product.handle} · {priceRangeLabel(product)} ·{" "}
                    {product.totalInventory === null
                      ? "stock unknown"
                      : `${product.totalInventory} in stock`}
                  </span>
                </div>
                <span
                  className={`hidden shrink-0 rounded-full px-3 py-1 text-xs sm:inline-block ${
                    saved.has(contentId(product.id))
                      ? "bg-[color:var(--botanical)]/10 text-[color:var(--botanical-deep)]"
                      : "bg-[color:var(--surface)] text-muted-foreground"
                  }`}
                >
                  {saved.has(contentId(product.id)) ? "Content saved" : "No content yet"}
                </span>
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
              </Link>
            </li>
          ))}
        </ul>
      )}

      <Link
        to="/admin/shared"
        className="mt-8 flex items-center gap-4 rounded-xl border border-border bg-card p-5 transition-colors sm:hover:border-[color:var(--gold)]"
      >
        <FileText className="h-5 w-5 shrink-0 text-[color:var(--gold)]" />
        <div className="min-w-0 flex-1">
          <span className="block text-[15px] text-foreground">Shared content</span>
          <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
            Certifications and the site-wide FAQ — used on several pages, so they are edited once
            here rather than per product.
          </span>
        </div>
        <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
      </Link>
    </AdminShell>
  );
}

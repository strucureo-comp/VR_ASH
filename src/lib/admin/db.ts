import { ENQUIRIES_PATH, SHARED_CONTENT_PATH } from "@/lib/content/paths";
import { enquiryMapSchema } from "@/lib/content/schema";
import type { EnquiryRecord, ProductContentForm, SharedContentForm } from "@/lib/content/types";

import type { FirebaseSdk } from "./firebase";

/**
 * Every write the admin panel makes, and the one read the storefront cannot do.
 *
 * Reads of `content/**` go through the server functions in `src/lib/content/api.ts`
 * so the copy lands in the SSR HTML; enquiries are different — the rules require an
 * allowlisted UID, and the only place that UID exists is the browser SDK.
 *
 * Writes use `set`, not `update`: the editor always submits the whole node, so a
 * list that shrank from five rows to three has to lose two, and a merge would keep
 * them.
 */

export async function writeProductContent(
  sdk: FirebaseSdk,
  contentId: string,
  value: ProductContentForm,
): Promise<void> {
  const { ref, set } = sdk.dbApi;
  await set(ref(sdk.db, `content/products/${contentId}`), { ...value, updatedAt: Date.now() });
}

export async function writeSharedContent(
  sdk: FirebaseSdk,
  value: SharedContentForm,
): Promise<void> {
  const { ref, set } = sdk.dbApi;
  await set(ref(sdk.db, SHARED_CONTENT_PATH), { ...value, updatedAt: Date.now() });
}

/** Newest first. A row that fails to parse is dropped, not fatal to the inbox. */
export async function readEnquiries(sdk: FirebaseSdk): Promise<EnquiryRecord[]> {
  const snapshot = await sdk.dbApi.get(sdk.dbApi.ref(sdk.db, ENQUIRIES_PATH));
  const parsed = enquiryMapSchema.safeParse(snapshot.val());
  if (!parsed.success) return [];

  return Object.entries(parsed.data)
    .flatMap(([id, enquiry]) => (enquiry ? [{ id, ...enquiry }] : []))
    .sort((a, b) => b.createdAt - a.createdAt);
}

export async function setEnquiryHandled(
  sdk: FirebaseSdk,
  id: string,
  handled: boolean,
): Promise<void> {
  const { ref, update } = sdk.dbApi;
  await update(ref(sdk.db, `${ENQUIRIES_PATH}/${id}`), { handled });
}

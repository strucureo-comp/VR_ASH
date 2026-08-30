import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { firebaseConfig } from "./env.server";
import { ENQUIRIES_PATH, SHARED_CONTENT_PATH } from "./paths";
import { pushNode, readNode } from "./rtdb.server";
import {
  contentIndexSchema,
  enquiryInputSchema,
  productContentSchema,
  sharedContentSchema,
} from "./schema";

/**
 * The only framework-coupled file in `src/lib/content/`, mirroring
 * `src/lib/shopify/api.ts`: everything it calls is a plain async function, so a
 * port to Next.js replaces these wrappers and nothing else.
 *
 * Reads go through the server rather than the browser SDK for two reasons: the
 * copy ends up in the SSR HTML where crawlers can see it, and the Firebase SDK
 * stays out of the storefront bundle entirely.
 */

/**
 * The public web config, handed to the admin panel so it can initialise the SDK.
 * Safe to expose — the apiKey identifies the project, it does not authorise
 * anything; the database rules are the boundary. It is served from here rather
 * than a `VITE_` variable so there is one place env is read.
 */
export const fetchFirebaseConfig = createServerFn({ method: "GET" }).handler(async () =>
  firebaseConfig(),
);

export const fetchProductContent = createServerFn({ method: "GET" })
  .validator(z.string().trim().min(1).max(64))
  .handler(async ({ data }) => readNode(`content/products/${data}`, productContentSchema));

export const fetchSharedContent = createServerFn({ method: "GET" }).handler(async () =>
  readNode(SHARED_CONTENT_PATH, sharedContentSchema),
);

/**
 * The ids of every product that already has a content record.
 *
 * Read shallow, so the admin list can show which products are still empty without
 * pulling every product's copy down to answer a yes/no question.
 */
export const fetchContentIndex = createServerFn({ method: "GET" }).handler(
  async () => (await readNode("content/products", contentIndexSchema, { shallow: "true" })) ?? [],
);

/**
 * Records an enquiry from `/contact` or `NotifyMe`.
 *
 * A filled honeypot is answered with success and dropped on the floor: telling a
 * bot it was caught only teaches it to stop filling the field.
 */
export const submitEnquiry = createServerFn({ method: "POST" })
  .validator(enquiryInputSchema)
  .handler(async ({ data }) => {
    if (data.honeypot !== "") return { ok: true as const };

    if (data.kind === "contact" && data.message === "") {
      return { ok: false as const, error: "Please tell us about your enquiry." };
    }

    await pushNode(ENQUIRIES_PATH, {
      kind: data.kind,
      name: data.name,
      email: data.email,
      phone: data.phone,
      message: data.message,
      product: data.product,
      createdAt: Date.now(),
      handled: false,
    });

    return { ok: true as const };
  });

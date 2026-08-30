import type { z } from "zod";

import { rtdbUrl } from "./env.server";

/**
 * Realtime Database over plain REST, no Firebase SDK.
 *
 * Every node is addressable as `<databaseURL>/<path>.json`, which is all the
 * storefront needs: reading server-side keeps the SDK out of the site bundle and
 * puts the content in the SSR HTML where crawlers can see it. The Firebase SDK
 * is loaded only under `/admin`, where a signed-in user needs realtime writes.
 *
 * No framework imports here — `api.ts` is the only file in this directory that
 * knows about TanStack Start.
 */

const TIMEOUT_MS = 10_000;

/**
 * Reads one node and validates it.
 *
 * Returns `null` for every failure — unconfigured, unreachable, non-200, absent
 * (the database answers a missing path with `200 null`), or malformed. Page copy
 * must never be able to take a page down, so the caller treats `null` as "no
 * extra content" and renders without those sections.
 */
export async function readNode<S extends z.ZodTypeAny>(
  path: string,
  schema: S,
  /** Appended verbatim, e.g. `{ shallow: "true" }` to fetch keys without values. */
  params?: Record<string, string>,
): Promise<z.output<S> | null> {
  const base = rtdbUrl();
  if (!base) return null;

  const query = params ? `?${new URLSearchParams(params).toString()}` : "";

  let response: Response;
  try {
    response = await fetch(`${base}/${path}.json${query}`, {
      headers: { accept: "application/json" },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch (cause) {
    const reason = cause instanceof Error ? cause.message : "unknown error";
    console.warn(`[content] could not read ${path}: ${reason}`);
    return null;
  }

  if (!response.ok) {
    console.warn(`[content] ${path} returned ${response.status} ${response.statusText}`);
    return null;
  }

  const raw: unknown = await response.json().catch(() => null);
  if (raw == null) return null;

  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    console.warn(`[content] ${path} did not match its schema:`, parsed.error.issues.slice(0, 5));
    return null;
  }
  return parsed.data as z.output<S>;
}

/**
 * Appends a child under `path` with a database-generated key.
 *
 * This runs with no credentials, so the rules have to allow an unauthenticated
 * create on `enquiries/$id` — see the rules in the plan. The caller validates
 * and rate-limits; the rules cap shape and length; nothing here can read or
 * modify what is already stored.
 */
export async function pushNode(path: string, value: unknown): Promise<string | null> {
  const base = rtdbUrl();
  if (!base) throw new Error("Firebase is not configured — set FIREBASE_DATABASE_URL.");

  const response = await fetch(`${base}/${path}.json`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(value),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(
      `Could not save to ${path}: ${response.status} ${response.statusText}. ${body.slice(0, 200)}`,
    );
  }

  const payload = (await response.json().catch(() => null)) as { name?: string } | null;
  return payload?.name ?? null;
}

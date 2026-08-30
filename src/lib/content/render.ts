import type { LucideIcon } from "lucide-react";

import { resolveIcon } from "./icons";
import type { Condition } from "./types";

/**
 * The three things every storefront page has to do with a content record.
 *
 * Kept out of the routes so the transition has one rule rather than one per page:
 * a saved list wins, an empty or missing one falls through to the array still in
 * `site.ts`. When those arrays are deleted, the fallback argument goes with them
 * and these helpers keep their shape.
 */

/** A condition or certification ready to render: `icon` is a component. */
export type IconRow = { icon: LucideIcon; title: string; body: string };

/** Database first, code second. */
export function preferSaved<T>(saved: readonly T[], fallback: readonly T[]): readonly T[] {
  return saved.length > 0 ? saved : fallback;
}

/**
 * Same rule, plus the one shape difference between the two sources: the database
 * stores an icon *name*, the arrays in `site.ts` hold the component itself.
 */
export function iconRows(
  saved: readonly Condition[],
  fallback: readonly IconRow[],
): readonly IconRow[] {
  if (saved.length === 0) return fallback;
  return saved.map((row) => ({ icon: resolveIcon(row.icon), title: row.title, body: row.body }));
}

/**
 * Blank-line separated paragraphs, which is what the editor's hint promises the
 * person typing. A single newline stays inside its paragraph.
 */
export function paragraphs(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter((part) => part !== "");
}

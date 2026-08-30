import type { FirebaseApp } from "firebase/app";
import type { Auth } from "firebase/auth";
import type { Database } from "firebase/database";

import type { FirebaseClientConfig } from "@/lib/content/env.server";

/**
 * Loads the Firebase JS SDK, and only ever in the browser under `/admin`.
 *
 * The imports below are dynamic on purpose: that is what keeps the SDK in its own
 * chunk instead of the storefront bundle, and what keeps it out of the SSR pass —
 * `firebase/auth` expects a browser. The type-only imports above are erased at
 * compile time and cost nothing.
 *
 * The whole module namespace is handed back rather than a hand-picked set of
 * re-exports, so a screen that needs one more database function does not have to
 * come back and edit this file.
 */

export type FirebaseAuthModule = typeof import("firebase/auth");
export type FirebaseDatabaseModule = typeof import("firebase/database");

export type FirebaseSdk = {
  app: FirebaseApp;
  auth: Auth;
  db: Database;
  authApi: FirebaseAuthModule;
  dbApi: FirebaseDatabaseModule;
};

let pending: Promise<FirebaseSdk> | null = null;

/** Memoised: every admin screen shares one app, one auth and one connection. */
export function loadFirebase(config: FirebaseClientConfig): Promise<FirebaseSdk> {
  pending ??= initialise(config);
  return pending;
}

async function initialise(config: FirebaseClientConfig): Promise<FirebaseSdk> {
  const [appApi, authApi, dbApi] = await Promise.all([
    import("firebase/app"),
    import("firebase/auth"),
    import("firebase/database"),
  ]);

  // Hot module replacement can re-run this; initialising twice throws.
  const app = appApi.getApps().length > 0 ? appApi.getApp() : appApi.initializeApp(config);

  return { app, auth: authApi.getAuth(app), db: dbApi.getDatabase(app), authApi, dbApi };
}

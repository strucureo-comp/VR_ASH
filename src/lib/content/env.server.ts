/**
 * Server-only Firebase configuration for the admin panel and the content reads.
 *
 * No `VITE_` prefix, for the same reason as `src/lib/shopify/env.server.ts`: the
 * Lovable vite config top-level-`define`s every `VITE_*` variable into the client
 * bundle. The web config below is public by design — the apiKey is a project
 * identifier, not a credential, and the Realtime Database rules are the actual
 * security boundary — but the storefront needs `databaseURL` on the server
 * anyway, so it is read here and handed to the browser by a server function
 * rather than being configured twice.
 */

/** The public web config the Firebase JS SDK needs to initialise in the browser. */
export type FirebaseClientConfig = {
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
};

/**
 * `null` when Firebase is not configured, so the site keeps working with the
 * admin panel and the extra product content simply switched off — the same
 * posture as `customerAccountConfig()` and sign-in.
 */
export function firebaseConfig(): FirebaseClientConfig | null {
  const apiKey = process.env["FIREBASE_API_KEY"];
  const databaseURL = process.env["FIREBASE_DATABASE_URL"];
  const projectId = process.env["FIREBASE_PROJECT_ID"];
  if (!apiKey || !databaseURL || !projectId) return null;

  return {
    apiKey,
    authDomain: process.env["FIREBASE_AUTH_DOMAIN"] ?? `${projectId}.firebaseapp.com`,
    databaseURL: databaseURL.replace(/\/$/, ""),
    projectId,
    storageBucket: process.env["FIREBASE_STORAGE_BUCKET"] ?? `${projectId}.firebasestorage.app`,
    messagingSenderId: process.env["FIREBASE_MESSAGING_SENDER_ID"] ?? "",
    appId: process.env["FIREBASE_APP_ID"] ?? "",
  };
}

/** Base URL for the REST reads in `rtdb.server.ts`. `null` when unconfigured. */
export function rtdbUrl(): string | null {
  return firebaseConfig()?.databaseURL ?? null;
}

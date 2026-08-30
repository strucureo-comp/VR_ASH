import { useCallback, useEffect, useState } from "react";

import type { FirebaseClientConfig } from "@/lib/content/env.server";

import { loadFirebase, type FirebaseSdk } from "./firebase";

/**
 * The admin sign-in gate, as a hook.
 *
 * Two things have to be true before a screen may render: Firebase says who you
 * are, and `admins/{uid}` says you are allowed. The second check is a courtesy —
 * the database rules refuse the write either way — but it turns a stack of
 * permission errors into one honest "this account is not an admin" screen.
 *
 * Everything runs in an effect, so the SDK is never touched during SSR.
 */

export type AdminStatus = "unconfigured" | "loading" | "signed-out" | "denied" | "ready";

export type AdminSession = {
  status: AdminStatus;
  sdk: FirebaseSdk | null;
  uid: string | null;
  email: string | null;
  /** Set by a failed sign-in, or by the SDK failing to load at all. */
  error: string | null;
  busy: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

type Identity = { status: AdminStatus; uid: string | null; email: string | null };

const SIGN_IN_FAILURES: Record<string, string> = {
  "auth/invalid-email": "That does not look like an email address.",
  "auth/invalid-credential": "Wrong email or password.",
  "auth/wrong-password": "Wrong email or password.",
  "auth/user-not-found": "Wrong email or password.",
  "auth/user-disabled": "That account has been disabled.",
  "auth/too-many-requests": "Too many attempts. Wait a minute and try again.",
  "auth/network-request-failed": "Could not reach Firebase. Check your connection.",
};

function describe(cause: unknown): string {
  const code =
    typeof cause === "object" && cause !== null && "code" in cause
      ? String((cause as { code: unknown }).code)
      : "";
  return SIGN_IN_FAILURES[code] ?? "Could not sign in. Please try again.";
}

export function useAdminSession(config: FirebaseClientConfig | null): AdminSession {
  const [sdk, setSdk] = useState<FirebaseSdk | null>(null);
  const [identity, setIdentity] = useState<Identity>({
    status: config ? "loading" : "unconfigured",
    uid: null,
    email: null,
  });
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!config) {
      setIdentity({ status: "unconfigured", uid: null, email: null });
      return;
    }

    let cancelled = false;
    let unsubscribe: (() => void) | null = null;

    void loadFirebase(config)
      .then((loaded) => {
        if (cancelled) return;
        setSdk(loaded);

        unsubscribe = loaded.authApi.onAuthStateChanged(loaded.auth, (user) => {
          if (cancelled) return;

          if (!user) {
            setIdentity({ status: "signed-out", uid: null, email: null });
            return;
          }

          const email = user.email ?? "";
          setIdentity({ status: "loading", uid: user.uid, email });

          void loaded.dbApi
            .get(loaded.dbApi.ref(loaded.db, `admins/${user.uid}`))
            .then((snapshot) => {
              if (cancelled) return;
              const allowed = snapshot.val() === true;
              setIdentity({ status: allowed ? "ready" : "denied", uid: user.uid, email });
            })
            .catch(() => {
              // A rules rejection reads the same as "not an admin" from here.
              if (!cancelled) setIdentity({ status: "denied", uid: user.uid, email });
            });
        });
      })
      .catch((cause: unknown) => {
        if (cancelled) return;
        console.error("Firebase failed to load", cause);
        setError("Could not load Firebase. Reload the page to try again.");
        setIdentity({ status: "signed-out", uid: null, email: null });
      });

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, [config]);

  const signIn = useCallback(
    async (email: string, password: string) => {
      if (!config) return;
      setBusy(true);
      setError(null);
      try {
        const loaded = await loadFirebase(config);
        await loaded.authApi.signInWithEmailAndPassword(loaded.auth, email, password);
      } catch (cause) {
        setError(describe(cause));
      } finally {
        setBusy(false);
      }
    },
    [config],
  );

  const signOut = useCallback(async () => {
    if (!sdk) return;
    setBusy(true);
    try {
      await sdk.authApi.signOut(sdk.auth);
    } finally {
      setBusy(false);
    }
  }, [sdk]);

  return {
    status: identity.status,
    sdk,
    uid: identity.uid,
    email: identity.email,
    error,
    busy,
    signIn,
    signOut,
  };
}

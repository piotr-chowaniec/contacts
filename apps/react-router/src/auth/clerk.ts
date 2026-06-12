import type { Auth } from "@contacts/queries";

// Minimal shape of the global Clerk singleton that ClerkProvider populates on
// `window`. `@clerk/react@6` exposes neither a typed `window.Clerk` nor a public
// `getClerkInstance()`, so we describe just the bits the loaders need.
type ClerkGlobal = {
  loaded: boolean;
  session?: {
    user: { id: string };
    getToken: Auth["getToken"];
  } | null;
};

/**
 * Reads the current auth snapshot from the Clerk singleton for use in React
 * Router loaders, which run outside the component tree and so cannot call
 * `useAuth()`. Returns `null` when Clerk has not finished loading or no user is
 * signed in — loaders treat that as "do not fetch", so no unauthenticated
 * request is ever sent. Once Clerk is loaded the component's own `useAuth()` +
 * `useSuspenseQuery` cover any window the loader skipped.
 */
export function getLoaderAuth(): Auth | null {
  const clerk = (window as unknown as { Clerk?: ClerkGlobal }).Clerk;
  if (!clerk?.loaded || !clerk.session) {
    return null;
  }

  const { session } = clerk;
  const getToken: Auth["getToken"] = (options) => session.getToken(options);

  return { userId: session.user.id, getToken };
}

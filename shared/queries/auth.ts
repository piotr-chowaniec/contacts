import type { useAuth } from "@clerk/react";

type UseAuthReturn = ReturnType<typeof useAuth>;

// The minimal auth surface the API/query layer needs: a user id (for per-user
// cache scoping) and a token getter (for the Bearer header). Derived from
// Clerk's `useAuth()` so the full hook result satisfies it — but narrow enough
// that a non-React caller (e.g. a router loader reading the Clerk singleton)
// can construct an equivalent object without depending on the hook.
export type Auth = {
  userId: UseAuthReturn["userId"];
  getToken: UseAuthReturn["getToken"];
};

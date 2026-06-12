import { useGetContactQueryOptions, useGetMyContactsQueryOptions } from "@contacts/queries";
import { ContactError } from "@contacts/ui/components/Contact.Error";
import {
  createBrowserRouter,
  createRoutesFromElements,
  type LoaderFunctionArgs,
  Route,
} from "react-router";

import { getLoaderAuth } from "./auth/clerk";
import { ContactsLayout } from "./components/ContactsLayout";
import { RootLayout } from "./components/RootLayout";
import { queryClient } from "./queryClient";
import { ContactDetail } from "./routes/ContactDetail";
import { ContactEdit } from "./routes/ContactEdit";
import { ContactNew } from "./routes/ContactNew";
import { ContactsIndex } from "./routes/ContactsIndex";
import { Home } from "./routes/Home";
import { Login } from "./routes/Login";

// "Best of Both Worlds": loaders kick off the fetch into the TanStack Query
// cache via `ensureQueryData`; components read the same cache with
// `useSuspenseQuery`.
//
// The prefetch is intentionally NOT awaited. Returning `null` immediately lets
// React Router transition right away, so the route's own `<Suspense>` boundary
// renders its skeleton (ContactSkeleton / RouteSpinner) while the request the
// loader already started is in flight — mirroring TanStack Router's
// `pendingComponent`. Because the request begins here (not on first render),
// there is still no render-then-fetch waterfall. Errors surface through
// `useSuspenseQuery` into the route `errorElement`; the trailing `.catch`
// only swallows the floating prefetch promise to avoid an unhandled rejection.
//
// Auth comes from the Clerk singleton (see getLoaderAuth); when it is null
// (Clerk not loaded / signed out) the loader skips fetching so no
// unauthenticated request is ever sent — the component then fetches once the
// user is signed in.

function contactsLoader({ request }: LoaderFunctionArgs) {
  const auth = getLoaderAuth();
  if (auth) {
    const q = new URL(request.url).searchParams.get("q") || undefined;
    // biome-ignore lint/correctness/useHookAtTopLevel: queryOptions factory, not a hook
    void queryClient.ensureQueryData(useGetMyContactsQueryOptions(auth, q)).catch(() => {});
  }
  return null;
}

function contactLoader({ params }: LoaderFunctionArgs) {
  const auth = getLoaderAuth();
  if (auth && params.contactId) {
    void queryClient
      // biome-ignore lint/correctness/useHookAtTopLevel: queryOptions factory, not a hook
      .ensureQueryData(useGetContactQueryOptions(auth, params.contactId))
      .catch(() => {});
  }
  return null;
}

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<RootLayout />}>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/contacts" loader={contactsLoader} element={<ContactsLayout />}>
        <Route index element={<ContactsIndex />} />
        <Route path="new" element={<ContactNew />} />
        <Route
          path=":contactId"
          loader={contactLoader}
          element={<ContactDetail />}
          errorElement={<ContactError />}
        />
        <Route path=":contactId/edit" loader={contactLoader} element={<ContactEdit />} />
      </Route>
    </Route>
  )
);

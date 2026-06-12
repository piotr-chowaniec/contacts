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
import { ContactsIndex } from "./routes/ContactsIndex";
import { Home } from "./routes/Home";
import { Login } from "./routes/Login";

// "Best of Both Worlds": loaders prefetch into the TanStack Query cache via
// `ensureQueryData`; components read the same cache with `useSuspenseQuery`.
// Auth comes from the Clerk singleton (see getLoaderAuth); when it is null
// (Clerk not loaded / signed out) the loader skips fetching so no
// unauthenticated request is ever sent — the component then fetches once the
// user is signed in.

async function contactsLoader({ request }: LoaderFunctionArgs) {
  const auth = getLoaderAuth();
  if (auth) {
    const q = new URL(request.url).searchParams.get("q") || undefined;
    // biome-ignore lint/correctness/useHookAtTopLevel: queryOptions factory, not a hook
    await queryClient.ensureQueryData(useGetMyContactsQueryOptions(auth, q));
  }
  return null;
}

async function contactLoader({ params }: LoaderFunctionArgs) {
  const auth = getLoaderAuth();
  if (auth && params.contactId) {
    // biome-ignore lint/correctness/useHookAtTopLevel: queryOptions factory, not a hook
    await queryClient.ensureQueryData(useGetContactQueryOptions(auth, params.contactId));
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
        <Route
          path=":contactId"
          loader={contactLoader}
          element={<ContactDetail />}
          errorElement={<ContactError />}
        />
      </Route>
    </Route>
  )
);

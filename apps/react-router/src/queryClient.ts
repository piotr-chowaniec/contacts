import { QueryClient } from "@tanstack/react-query";

// Single QueryClient instance shared between the React component tree
// (<QueryClientProvider>) and the route loaders, which close over it directly.
//
// `retry: false` because every query is gated behind a signed-in guard
// (`<Show when="signed-in">` for the list, the signed-in `/contacts` Outlet for
// detail/edit), so a failed request is a real error (e.g. a non-existent
// contact) — not a transient pre-auth 401 worth retrying. Surfacing it
// immediately drives the route `errorElement` without waiting out retry
// backoff.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

import { ClerkProvider } from "@clerk/react";
import { QueryClientProvider } from "@tanstack/react-query";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router";

import "@contacts/ui/styles/global.css";

import { queryClient } from "./queryClient";
import { router } from "./router";

function App() {
  return (
    <ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>
      <QueryClientProvider client={queryClient}>
        {/* useTransitions={false} disables React Router's internal
            React.startTransition wrapping of navigations. With it on (the v7
            default), a route that re-suspends mid-navigation keeps the previous
            page on screen instead of showing its <Suspense> fallback. Turning it
            off makes navigations urgent, so each route shows its skeleton while
            its loader-started query is in flight — matching TanStack Router. */}
        <RouterProvider router={router} useTransitions={false} />
      </QueryClientProvider>
    </ClerkProvider>
  );
}

const rootElement = document.getElementById("app");
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
}

import { Show, SignInButton, UserButton } from "@clerk/react";
import { ClerkProvider } from "@clerk/tanstack-react-start";
import { auth } from "@clerk/tanstack-react-start/server";
import styles from "@contacts/ui/styles/global.css?url";
import type { QueryClient } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  HeadContent,
  Link,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import * as React from "react";

const DevToolsPanel = React.lazy(() =>
  import("../components/DevToolsPanel").then((m) => ({ default: m.DevToolsPanel }))
);

import { DefaultCatchBoundary } from "../components/DefaultCatchBoundary";
import { NotFound } from "../components/NotFound";

const fetchClerkAuth = createServerFn({ method: "GET" }).handler(async () => {
  const { userId } = await auth();

  return {
    auth: { userId },
  };
});

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  beforeLoad: async () => {
    const { auth } = await fetchClerkAuth();

    return {
      auth,
    };
  },
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Contacts - TanStack Start",
      },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: styles },
    ],
  }),
  errorComponent: (props) => {
    return (
      <ClerkProvider>
        <RootDocument>
          <DefaultCatchBoundary {...props} />
        </RootDocument>
      </ClerkProvider>
    );
  },
  notFoundComponent: () => <NotFound />,
  component: RootComponent,
});

function RootComponent() {
  return (
    <ClerkProvider>
      <RootDocument>
        <Outlet />
      </RootDocument>
    </ClerkProvider>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <div className="flex h-screen w-screen flex-col p-2">
          <div className={`col flex items-center justify-between gap-2 border-b pb-2`}>
            <h1 className="p-2 text-3xl">Contacts App</h1>
            <div className="mr-4 flex items-center">
              <Show when="signed-out">
                <SignInButton />
              </Show>
              <Show when="signed-in">
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "w-10! h-10!",
                    },
                  }}
                />
              </Show>
            </div>
          </div>
          <div className={`flex h-full`}>
            <div className={`w-40 divide-y`}>
              <Link
                to={"/"}
                activeProps={{
                  className: "font-bold",
                }}
                className="block px-3 py-2 text-blue-700"
              >
                Home
              </Link>
              <Link
                to={"/contacts"}
                activeProps={{
                  className: "font-bold",
                }}
                className="block px-3 py-2 text-blue-700"
              >
                Contacts
              </Link>
              <Show when="signed-out">
                <Link
                  to={"/login"}
                  activeProps={{
                    className: "font-bold",
                  }}
                  className="block px-3 py-2 text-blue-700"
                >
                  Sign in
                </Link>
              </Show>
            </div>
            <div className={`flex h-full flex-1 border-l`}>{children}</div>
          </div>
        </div>
        {mounted && (
          <React.Suspense>
            <DevToolsPanel />
          </React.Suspense>
        )}
        <Scripts />
      </body>
    </html>
  );
}

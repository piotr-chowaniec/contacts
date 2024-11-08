import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/tanstack-start";
import { getAuth } from "@clerk/tanstack-start/server";
import type { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  Link,
  Outlet,
  ScrollRestoration,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { Body, createServerFn, Head, Html, Meta, Scripts } from "@tanstack/start";
import * as React from "react";
import { DefaultCatchBoundary } from "~/components/DefaultCatchBoundary";
import { NotFound } from "~/components/NotFound";

import styles from "@contacts/ui/styles/global.css?url";

const fetchClerkAuth = createServerFn("GET", async (_, ctx) => {
  const auth = await getAuth(ctx.request);

  return {
    auth,
  };
});

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  meta: () => [
    {
      charSet: "utf-8",
    },
    {
      name: "viewport",
      content: "width=device-width, initial-scale=1",
    },
    {
      title: "TanStack Start Starter",
    },
  ],
  links: () => [{ rel: "stylesheet", href: styles }],
  beforeLoad: async () => {
    const { auth } = await fetchClerkAuth();
    return {
      auth,
    };
  },
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
  return (
    <Html>
      <Head>
        <Meta />
      </Head>
      <Body>
        <div className="flex h-screen w-screen flex-col p-2">
          <div className={`col flex items-center justify-between gap-2 border-b pb-2`}>
            <h1 className="p-2 text-3xl">Contacts App</h1>
            <div className="mr-4 flex items-center">
              <SignedOut>
                <SignInButton />
              </SignedOut>
              <SignedIn>
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "w-10 h-10",
                    },
                  }}
                />
              </SignedIn>
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
              <SignedOut>
                <Link
                  to={"/login"}
                  activeProps={{
                    className: "font-bold",
                  }}
                  className="block px-3 py-2 text-blue-700"
                >
                  Sign in
                </Link>
              </SignedOut>
            </div>
            <div className={`flex h-full flex-1 border-l`}>
              <Outlet />
            </div>
          </div>
        </div>
        <ScrollRestoration />
        <TanStackRouterDevtools position="bottom-right" />
        <ReactQueryDevtools buttonPosition="bottom-left" />
        <Scripts />
      </Body>
    </Html>
  );
}

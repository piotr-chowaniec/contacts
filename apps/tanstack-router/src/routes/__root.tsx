import { SignedOut, SignInButton, SignedIn, UserButton } from "@clerk/clerk-react";
import type { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Link, Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

import { Auth } from "../utils/auth";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
  auth: Auth;
}>()({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
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
      <ReactQueryDevtools buttonPosition="bottom-left" />
      <TanStackRouterDevtools position="bottom-right" />
    </>
  );
}

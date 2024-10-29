import { ClerkApp, SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/remix";
import { rootAuthLoader } from "@clerk/remix/ssr.server";
import type { LinksFunction } from "@remix-run/node";
import type { LoaderFunction } from "@remix-run/node";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
} from "@remix-run/react";

import styles from "@contacts/ui/styles/global.css?url";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

export const loader: LoaderFunction = (args) => rootAuthLoader(args);

export function ErrorBoundary() {
  const error = useRouteError();

  const ErrorToRender = () => {
    if (isRouteErrorResponse(error)) {
      return (
        <div>
          <h1>
            {error.status} {error.statusText}
          </h1>
          <p>{error.data}</p>
        </div>
      );
    } else if (error instanceof Error) {
      return (
        <div>
          <h1>Error</h1>
          <p>{error.message}</p>
          <p>The stack trace is:</p>
          <pre>{error.stack}</pre>
        </div>
      );
    } else {
      return <h1>Unknown Error</h1>;
    }
  };

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="m-2">
        <div className={`flex min-h-screen w-full flex-col`}>
          <div className={`col flex items-center justify-between gap-2 border-b pb-2`}>
            <h1 className={`p-2 text-3xl`}>Contacts App</h1>
          </div>
          <div className={`flex flex-1`}>
            <div className={`w-40 divide-y`}>
              {(
                [
                  ["/", "Home"],
                  ["/contacts", "Contacts"],
                ] as const
              ).map(([to, label]) => {
                return (
                  <div key={to}>
                    <NavLink
                      to={to}
                      className={({ isActive }) =>
                        `block px-3 py-2 text-blue-700 ${isActive ? `font-bold` : ``}`
                      }
                    >
                      {label}
                    </NavLink>
                  </div>
                );
              })}
            </div>
            <div className={`flex flex-1 flex-col items-center justify-center border-l`}>
              <ErrorToRender />
            </div>
          </div>
        </div>
        <Scripts />
      </body>
    </html>
  );
}

function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="m-2">
        <div className={`flex min-h-screen w-full flex-col`}>
          <div className={`col flex items-center justify-between gap-2 border-b pb-2`}>
            <h1 className={`p-2 text-3xl`}>Contacts App</h1>
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
          <div className={`flex flex-1`}>
            <div className={`w-40 divide-y`}>
              <NavLink
                to={"/"}
                className={({ isActive }) =>
                  `block px-3 py-2 text-blue-700 ${isActive ? `font-bold` : ``}`
                }
              >
                Home
              </NavLink>
              <NavLink
                to={"/contacts"}
                className={({ isActive }) =>
                  `block px-3 py-2 text-blue-700 ${isActive ? `font-bold` : ``}`
                }
              >
                Contacts
              </NavLink>
              <SignedOut>
                <NavLink
                  to={"/login"}
                  className={({ isActive }) =>
                    `block px-3 py-2 text-blue-700 ${isActive ? `font-bold` : ``}`
                  }
                >
                  Sign in
                </NavLink>
              </SignedOut>
            </div>
            <div className={`flex flex-1 border-l`}>
              <Outlet />
            </div>
          </div>
        </div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default ClerkApp(App);

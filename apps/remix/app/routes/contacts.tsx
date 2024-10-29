import { getAuth } from "@clerk/remix/ssr.server";
import { defer, redirect } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";
import {
  Form,
  isRouteErrorResponse,
  NavLink,
  Outlet,
  useLoaderData,
  useNavigate,
  useNavigation,
  useRouteError,
  useSubmit,
  Await,
} from "@remix-run/react";
import { Suspense, useEffect, useState } from "react";

import { getMyContacts } from "@contacts/server/queries";
import { Spinner } from "@contacts/ui/components/Spinner";

export const loader = async (args: LoaderFunctionArgs) => {
  const { userId } = await getAuth(args);
  if (!userId) {
    return redirect("/login");
  }

  const url = new URL(args.request.url);
  const q = url.searchParams.get("search");
  const contactsPromise = getMyContacts(userId, q);
  return defer({ contacts: contactsPromise, q });
};

export function ErrorBoundary() {
  const error = useRouteError();

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
}

const RouteSpinner = () => (
  <div className="mt-10 flex w-full justify-center">
    <div className="h-16 w-16">
      <Spinner show={true} />
    </div>
  </div>
);

export default function ContactsLayout() {
  const { contacts, q } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const navigate = useNavigate();
  const submit = useSubmit();
  const [query, setQuery] = useState(q || "");
  const searching = navigation.location && new URLSearchParams(navigation.location.search).has("q");
  const isLoading = navigation.state === "loading";

  useEffect(() => {
    setQuery(q || "");
  }, [q]);

  return (
    <>
      <Suspense fallback={<RouteSpinner />}>
        <Await resolve={contacts}>
          {(contacts) => (
            <>
              <div className="flex w-80 flex-col items-center gap-4 divide-y border-r py-6">
                <div className="flex w-full flex-col items-center gap-4 px-6">
                  <Form
                    className="w-full"
                    role="search"
                    onChange={(event) => {
                      const isFirstSearch = q === null;
                      submit(event.currentTarget, {
                        replace: !isFirstSearch,
                      });
                    }}
                  >
                    <input
                      aria-label="Search contacts"
                      id="search"
                      name="search"
                      className={`w-full rounded p-1 px-2 ${searching ? "loading" : ""}`}
                      onChange={(event) => setQuery(event.currentTarget.value)}
                      placeholder="Search..."
                      value={query}
                    />
                  </Form>
                  <button
                    type="submit"
                    className="h-8 w-full p-0"
                    onClick={() => navigate("/contacts/new")}
                  >
                    New
                  </button>
                </div>
                <nav className="w-full flex-1 p-4">
                  {contacts.length ? (
                    <ul>
                      {contacts.map((contact) => (
                        <li key={contact.id}>
                          <NavLink
                            to={`/contacts/${contact.id}`}
                            className={({ isActive, isPending }) =>
                              `flex min-h-10 justify-between p-3 text-blue-700 ${isActive ? "font-bold" : isPending ? "pending" : ""}`
                            }
                          >
                            {contact.firstName || contact.lastName ? (
                              <>
                                {contact.firstName} {contact.lastName}
                              </>
                            ) : (
                              <i>No Name</i>
                            )}{" "}
                            {contact.favorite ? <span className="text-yellow-400">★</span> : null}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>
                      <i>No contacts</i>
                    </p>
                  )}
                </nav>
              </div>
              <div
                className={`w-full p-14 ${isLoading && !searching ? "opacity-25 transition-opacity delay-200" : ""}`}
              >
                <Outlet context={{ noContacts: contacts.length === 0 }} />
              </div>
            </>
          )}
        </Await>
      </Suspense>
    </>
  );
}

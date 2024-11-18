import { getAuth } from "@clerk/remix/ssr.server";
import { defer, redirect } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";
import {
  isRouteErrorResponse,
  NavLink,
  Outlet,
  useLoaderData,
  useNavigate,
  useRouteError,
  Await,
  useSearchParams,
  useLocation,
} from "@remix-run/react";
import _ from "lodash";
import { Suspense, useEffect, useMemo, useState } from "react";

import { Contact } from "@contacts/server/db/schema";
import { getMyContacts } from "@contacts/server/queries";
import { RouteSpinner } from "@contacts/ui/components/Spinner";

type SortBy = "firstName" | "lastName" | "email";

export const loader = async (args: LoaderFunctionArgs) => {
  const { userId } = await getAuth(args);
  if (!userId) {
    return redirect("/login");
  }

  const url = new URL(args.request.url);
  const q = url.searchParams.get("q");
  const sortBy = (url.searchParams.get("sortBy") as SortBy) || "firstName";
  const contactsPromise = getMyContacts(userId, q);

  return defer({ contactsPromise, q, sortBy });
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

export default function ContactsLayout() {
  const { contactsPromise, q } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      <div className="flex h-full w-80 flex-col items-center gap-4 border-r py-4">
        <div className="flex w-full flex-col items-center gap-4 px-6">
          <ContactSort />
          <ContactSearch />
          <button
            className="h-8 w-full p-0"
            onClick={() => navigate(`/contacts/new${location.search}`)}
          >
            New
          </button>
        </div>
        <div className="h-full w-full overflow-scroll px-6">
          <Suspense fallback={<RouteSpinner />}>
            <Await resolve={contactsPromise}>
              {(contacts) => <ContactsList contacts={contacts as unknown as Contact[]} />}
            </Await>
          </Suspense>
        </div>
      </div>
      <div className="flex-1 p-14">
        <Suspense fallback={<RouteSpinner />}>
          <Await resolve={contactsPromise}>
            {(contacts) => <Outlet context={{ noContacts: contacts.length === 0 && !q }} />}
          </Await>
        </Suspense>
      </div>
    </>
  );
}

const ContactSort = () => {
  const [, setSearchParams] = useSearchParams();
  const { sortBy } = useLoaderData<typeof loader>();

  const setSortBy = (sortBy: SortBy) =>
    setSearchParams((prev) => {
      prev.set("sortBy", sortBy);
      return prev;
    });

  return (
    <div className="flex w-full items-center gap-2">
      Sort By:
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value as SortBy)}
        className="h-8 flex-1 rounded border p-1 px-2"
      >
        {[
          { value: "firstName", label: "First Name" },
          { value: "lastName", label: "Last Name" },
          { value: "email", label: "Email" },
        ].map(({ value, label }) => {
          return <option key={value} value={value} children={label} />;
        })}
      </select>
    </div>
  );
};

const ContactSearch = () => {
  const { q } = useLoaderData<typeof loader>();
  const [, setSearchParams] = useSearchParams();
  const [queryInput, setQueryInput] = useState(q || "");
  const [querySearch, setQuerySearch] = useState(q || "");

  useEffect(() => {
    setQueryInput(q || "");
    setQuerySearch(q || "");
  }, [q]);

  useEffect(() => {
    setSearchParams((prev) => {
      if (querySearch) {
        prev.set("q", querySearch);
      } else {
        prev.delete("q");
      }

      return prev;
    });
  }, [querySearch]);

  const debounceSearchParamChange = useMemo(
    () =>
      _.debounce((value: string) => {
        setQuerySearch(value);
      }, 500),
    [],
  );

  return (
    <input
      aria-label="Search contacts"
      id="search"
      name="search"
      className="w-full rounded p-1 px-2"
      onChange={(e) => {
        const value = e.target.value;
        setQueryInput(value);
        debounceSearchParamChange(value);
      }}
      placeholder="Search..."
      value={queryInput}
    />
  );
};

const ContactsList = ({ contacts }: { contacts: Contact[] }) => {
  const { sortBy } = useLoaderData<typeof loader>();
  const location = useLocation();

  if (contacts.length === 0) {
    return <p>No contacts</p>;
  }

  const sortedContacts = _.sortBy(contacts, sortBy);

  return (
    <ul className="h-10">
      {sortedContacts.map((contact) => (
        <li key={contact.id}>
          <NavLink
            to={{
              pathname: `/contacts/${contact.id}`,
              search: location.search,
            }}
            className={({ isActive }) =>
              `flex justify-between py-1 text-blue-700 ${isActive ? "font-bold" : ""}`
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
  );
};

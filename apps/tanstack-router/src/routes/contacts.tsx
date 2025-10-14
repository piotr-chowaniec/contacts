import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, Navigate, Outlet } from "@tanstack/react-router";
import _ from "lodash";
import { Suspense, useEffect, useMemo, useState } from "react";

import { RouteSpinner } from "@contacts/ui/components/Spinner";

import { useGetMyContactsQueryOptions } from "../utils/queryOptions";

type SortBy = "firstName" | "lastName" | "email";

export const Route = createFileRoute("/contacts")({
  validateSearch: (search) =>
    search as {
      q?: string;
      sortBy?: SortBy;
    },
  loaderDeps: ({ search: { q } }) => ({ q }),
  loader: (opts) => {
    if (opts.context.auth.userId) {
      opts.context.queryClient.ensureQueryData(
        useGetMyContactsQueryOptions(opts.context.auth, opts.deps.q),
      );
    }
  },
  pendingComponent: RouteSpinner,
  component: ContactsComponent,
});

function ContactsComponent() {
  const navigate = Route.useNavigate();

  return (
    <>
      <SignedOut>
        <Navigate to={"/login"} search={{ redirect: "/contacts" }} />
      </SignedOut>
      <SignedIn>
        <div className="flex h-full w-80 flex-col items-center gap-4 border-r py-4">
          <div className="flex w-full flex-col items-center gap-4 px-6">
            <ContactSort />
            <ContactSearch />
            <button
              type="submit"
              className="h-8 w-full p-0"
              onClick={() =>
                void navigate({
                  to: "/contacts/new",
                  search: (old) => old,
                })
              }
            >
              New
            </button>
          </div>
          <div className="h-full w-full overflow-scroll px-6">
            <Suspense fallback={<RouteSpinner />}>
              <ContactsList />
            </Suspense>
          </div>
        </div>
        <div className="flex-1 p-14">
          <Outlet />
        </div>
      </SignedIn>
    </>
  );
}

const ContactSort = () => {
  const navigate = Route.useNavigate();
  const searchParams = Route.useSearch();
  const sortBy = searchParams.sortBy || "firstName";

  const setSortBy = (sortBy: SortBy) =>
    navigate({
      search: (old) => {
        return {
          ...old,
          sortBy,
        };
      },
      replace: true,
    });

  return (
    <div className="flex w-full items-center gap-2">
      Sort By:
      <select
        value={sortBy}
        onChange={(e) => void setSortBy(e.target.value as SortBy)}
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
  const navigate = Route.useNavigate();
  const { q } = Route.useSearch();
  const [queryInput, setQueryInput] = useState(q || "");
  const [querySearch, setQuerySearch] = useState(q || "");

  useEffect(() => {
    setQueryInput(q || "");
    setQuerySearch(q || "");
  }, [q]);

  useEffect(() => {
    void navigate({
      search: (old) => {
        const newSearchParams = _.pickBy(
          {
            ...old,
            q: querySearch,
          },
          Boolean,
        );

        return newSearchParams;
      },
      replace: true,
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

const ContactsList = () => {
  const { q, sortBy = "firstName" } = Route.useSearch();
  const context = Route.useRouteContext();

  const contactsQuery = useSuspenseQuery(useGetMyContactsQueryOptions(context.auth, q));
  const { contacts } = contactsQuery.data;

  if (contacts.length === 0) {
    return <p>No contacts</p>;
  }

  const sortedContacts = _.sortBy(contacts, sortBy);

  return (
    <ul className="h-10">
      {sortedContacts.map((contact) => (
        <li key={contact.id}>
          <Link
            to={`/contacts/${contact.id}`}
            search={(prev) => prev}
            activeProps={{
              className: "font-bold",
            }}
            className={"flex justify-between py-1 text-blue-700"}
          >
            {contact.firstName || contact.lastName ? (
              <>
                {contact.firstName} {contact.lastName}
              </>
            ) : (
              <i>No Name</i>
            )}{" "}
            {contact.favorite ? <span className="text-yellow-400">★</span> : null}
          </Link>
        </li>
      ))}
    </ul>
  );
};

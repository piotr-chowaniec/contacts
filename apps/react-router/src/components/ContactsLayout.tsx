import { Show, useAuth } from "@clerk/react";
import { useGetMyContactsQueryOptions } from "@contacts/queries";
import { RouteSpinner } from "@contacts/ui/components/Spinner";
import { useSuspenseQuery } from "@tanstack/react-query";
import _ from "lodash";
import { Suspense, useEffect, useMemo, useState } from "react";
import { Navigate, NavLink, Outlet, useNavigate, useSearchParams } from "react-router";

type SortBy = "firstName" | "lastName" | "email";

const contactLinkClass = ({ isActive }: { isActive: boolean }) =>
  `flex justify-between py-1 text-blue-700${isActive ? " font-bold" : ""}`;

export function ContactsLayout() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const search = searchParams.toString();

  return (
    <>
      <Show when="signed-out">
        <Navigate to="/login?redirect=/contacts" replace />
      </Show>
      <Show when="signed-in">
        <div className="flex h-full w-80 flex-col items-center gap-4 border-r py-4">
          <div className="flex w-full flex-col items-center gap-4 px-6">
            <ContactSort />
            <ContactSearch />
            <button
              type="submit"
              className="h-8 w-full p-0"
              onClick={() => navigate(search ? `/contacts/new?${search}` : "/contacts/new")}
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
      </Show>
    </>
  );
}

const ContactSort = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const sortBy = (searchParams.get("sortBy") as SortBy) || "firstName";

  const setSortBy = (value: SortBy) =>
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set("sortBy", value);
        return next;
      },
      { replace: true }
    );

  return (
    <div className="flex w-full items-center gap-2">
      Sort By:
      <select
        aria-label="Sort by"
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value as SortBy)}
        className="h-8 flex-1 rounded border p-1 px-2"
      >
        {[
          { value: "firstName", label: "First Name" },
          { value: "lastName", label: "Last Name" },
          { value: "email", label: "Email" },
        ].map(({ value, label }) => {
          return (
            <option key={value} value={value}>
              {label}
            </option>
          );
        })}
      </select>
    </div>
  );
};

const ContactSearch = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const [queryInput, setQueryInput] = useState(q);

  useEffect(() => {
    setQueryInput(q);
  }, [q]);

  const debounceSearchParamChange = useMemo(
    () =>
      _.debounce((value: string) => {
        setSearchParams(
          (prev) => {
            const next = new URLSearchParams(prev);
            if (value) {
              next.set("q", value);
            } else {
              next.delete("q");
            }
            return next;
          },
          { replace: true }
        );
      }, 500),
    [setSearchParams]
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
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q") || undefined;
  const sortBy = (searchParams.get("sortBy") as SortBy) || "firstName";
  const search = searchParams.toString();
  const auth = useAuth();

  const contactsQuery = useSuspenseQuery(useGetMyContactsQueryOptions(auth, q));
  const { contacts } = contactsQuery.data;

  if (contacts.length === 0) {
    return <p>No contacts</p>;
  }

  const sortedContacts = _.sortBy(contacts, sortBy);

  return (
    <ul aria-label="Contacts" className="h-10">
      {sortedContacts.map((contact) => (
        <li key={contact.id}>
          <NavLink
            to={search ? `/contacts/${contact.id}?${search}` : `/contacts/${contact.id}`}
            className={contactLinkClass}
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

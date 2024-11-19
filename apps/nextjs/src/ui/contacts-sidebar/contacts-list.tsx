"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import _ from "lodash";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useGetMyContactsQueryOptions } from "~/server/queryOptions";

export type SortBy = "firstName" | "lastName" | "email";

export function ContactsList({ sortBy, q }: { sortBy: SortBy; q: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const {
    data: { contacts },
  } = useSuspenseQuery(useGetMyContactsQueryOptions(q));

  if (contacts.length === 0) {
    return <p>No contacts</p>;
  }

  const sortedContacts = _.sortBy(contacts, sortBy);

  return (
    <ul className="h-10">
      {sortedContacts.map((contact) => (
        <li key={contact.id}>
          <Link
            href={`/contacts/${contact.id}${searchParams ? `?${searchParams.toString()}` : ""}`}
            className={`flex justify-between py-1 text-blue-700 ${pathname.includes(`/contacts/${contact.id}`) ? "font-bold" : ""}`}
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
}

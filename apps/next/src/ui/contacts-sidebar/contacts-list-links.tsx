"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

import { Contact } from "@contacts/server/db/schema";

export function ContactsLinks({ contacts }: { contacts: Contact[] }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <>
      {contacts.map((contact) => (
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
    </>
  );
}

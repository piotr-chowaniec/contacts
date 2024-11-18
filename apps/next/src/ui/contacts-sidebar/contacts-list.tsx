import _ from "lodash";
import { getMyContactsServerFn } from "~/server/queries";

import { ContactsLinks } from "./contacts-list-links";

export type SortBy = "firstName" | "lastName" | "email";

export async function ContactsList({ sortBy, q }: { sortBy: SortBy; q: string }) {
  const { contacts } = await getMyContactsServerFn(q);

  if (contacts.length === 0) {
    return <p>No contacts</p>;
  }

  const sortedContacts = _.sortBy(contacts, sortBy);

  return (
    <ul className="h-10">
      <ContactsLinks contacts={sortedContacts} />
    </ul>
  );
}

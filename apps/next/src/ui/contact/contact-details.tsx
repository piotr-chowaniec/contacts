import { notFound } from "next/navigation";
import { getContactServerFn } from "~/server/queries";

import { ContactDetails as ContactComponent } from "@contacts/ui/components/Contact.Details";

import { ContactDeleteButton } from "./contact-delete-button";
import { ContactEditButton } from "./contact-edit-button";
import { Favorite } from "./contact-favorite-button";

export async function ContactDetails({ id }: { id: string }) {
  const { contact } = await getContactServerFn(id);

  if (!contact) {
    notFound();
  }

  return (
    <ContactComponent contact={contact}>
      <Favorite contact={contact} />
      <ContactEditButton contactId={id} />
      <ContactDeleteButton contactId={id} />
    </ContactComponent>
  );
}

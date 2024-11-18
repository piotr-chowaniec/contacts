import Image from "next/image";
import { notFound } from "next/navigation";
import { getContactServerFn } from "~/server/queries";

import avatarFallback from "@contacts/ui/assets/images/avatar-fallback.png";
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
    <ContactComponent
      contact={contact}
      ContactImage={
        <Image
          alt={`${contact.firstName} ${contact.lastName} avatar`}
          key={contact.avatarUrl || "fallback"}
          src={contact.avatarUrl || avatarFallback}
          width={240}
          height={240}
        />
      }
      Favorite={<Favorite contact={contact} />}
      EditButton={<ContactEditButton contactId={id} />}
      DeleteButton={<ContactDeleteButton contactId={id} />}
    />
  );
}

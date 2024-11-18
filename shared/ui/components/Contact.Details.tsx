import { Contact } from "@contacts/server/db/schema";

export const ContactDetails = ({
  contact,
  ContactImage,
  Favorite,
  EditButton,
  DeleteButton,
}: {
  contact: Contact;
  ContactImage: React.ReactNode;
  Favorite: React.ReactNode;
  EditButton: React.ReactNode;
  DeleteButton: React.ReactNode;
}) => (
  <div className="flex gap-10">
    <div className="h-60 w-60 overflow-hidden rounded-3xl bg-white">{ContactImage}</div>

    <div className="flex flex-col gap-6">
      <h1 className="align-center flex gap-4 text-3xl font-bold">
        {contact.firstName || contact.lastName ? (
          <>
            {contact.firstName} {contact.lastName}
          </>
        ) : (
          <i>No Name</i>
        )}{" "}
        {Favorite}
      </h1>

      {contact.email ? (
        <a href={`mailto: ${contact.email}`} className="text-blue-700">
          {contact.email}
        </a>
      ) : null}

      <div className="flex gap-4">
        {EditButton}
        {DeleteButton}
      </div>
    </div>
  </div>
);

import { Contact } from "@contacts/server/db/schema";

import avatarFallback from "../assets/images/avatar-fallback.png";

export const ContactDetails = ({
  contact,
  children,
}: {
  contact: Contact;
  children: React.ReactNode[];
}) => (
  <div className="flex gap-10">
    <div className="h-60 w-60 overflow-hidden rounded-3xl bg-white">
      <img
        alt={`${contact.firstName} ${contact.lastName} avatar`}
        key={contact.avatarUrl || "fallback"}
        src={contact.avatarUrl || avatarFallback}
      />
    </div>

    <div className="flex flex-col gap-6">
      <h1 className="align-center flex gap-4 text-3xl font-bold">
        {contact.firstName || contact.lastName ? (
          <>
            {contact.firstName} {contact.lastName}
          </>
        ) : (
          <i>No Name</i>
        )}{" "}
        {children[0]}
      </h1>

      {contact.email ? (
        <a href={`mailto: ${contact.email}`} className="text-blue-700">
          {contact.email}
        </a>
      ) : null}

      <div className="flex gap-4">
        {children[1]}
        {children[2]}
      </div>
    </div>
  </div>
);

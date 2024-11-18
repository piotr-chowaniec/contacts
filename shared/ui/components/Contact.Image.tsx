import { Contact } from "@contacts/server/db/schema";

import avatarFallback from "../assets/images/avatar-fallback.png";

export const ContactImage = ({ contact }: { contact: Contact }) => (
  <img
    alt={`${contact.firstName} ${contact.lastName} avatar`}
    key={contact.avatarUrl || "fallback"}
    src={contact.avatarUrl || avatarFallback}
  />
);

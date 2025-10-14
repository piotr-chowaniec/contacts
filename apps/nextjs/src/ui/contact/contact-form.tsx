"use client";

import type { Contact } from "@contacts/server/db/schema";
import { EditForm } from "@contacts/ui/components/Contact.Form";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";

export function ContactEditForm({
  contact,
  errors,
}: {
  contact?: Contact;
  errors?: Record<string, string[]>;
}) {
  const router = useRouter();
  const { pending } = useFormStatus();

  return (
    <EditForm contact={contact} errors={errors} isPending={pending} back={() => router.back()} />
  );
}

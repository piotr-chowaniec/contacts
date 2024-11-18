"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { updateContactServerFn } from "~/server/queries";

import { Contact } from "@contacts/server/db/schema";
import { UpdateContactSchema } from "@contacts/server/validation";

import { ContactEditForm } from "./contact-form";

export function ContactEdit({ contact }: { contact: Contact }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const formData = new FormData(event.target as HTMLFormElement);

    const validatedFields = UpdateContactSchema.safeParse({
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      avatarUrl: formData.get("avatarUrl"),
    });

    if (!validatedFields.success) {
      setErrors(validatedFields.error.flatten().fieldErrors);
      return;
    }

    await updateContactServerFn(contact.id, validatedFields.data);

    router.push(`/contacts/${contact.id}${searchParams ? `?${searchParams.toString()}` : ""}`);
  };

  return (
    <form
      className="flex max-w-xl flex-col gap-4"
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      onSubmit={onSubmit}
    >
      <ContactEditForm contact={contact} errors={errors} />
    </form>
  );
}
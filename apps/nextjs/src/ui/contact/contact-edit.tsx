"use client";

import { UpdateContactSchema } from "@contacts/server/validation";
import { useSuspenseQuery } from "@tanstack/react-query";
import { notFound, useRouter, useSearchParams } from "next/navigation";
import { type FormEvent, useState } from "react";
import { getQueryClient } from "~/get-query-client";
import { updateContactServerFn } from "~/server/queries";
import { useGetContactQueryOptions } from "~/server/queryOptions";

import { ContactEditForm } from "./contact-form";

export function ContactEdit({ id }: { id: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = getQueryClient();
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const contactQuery = useSuspenseQuery(useGetContactQueryOptions(id));
  const { contact } = contactQuery.data;

  if (!contact) {
    notFound();
  }

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

    await queryClient.invalidateQueries({
      queryKey: ["contact"],
    });

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

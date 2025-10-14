import { UpdateContactSchema } from "@contacts/server/validation";
import { EditForm } from "@contacts/ui/components/Contact.Form";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";

import { useCreateContactMutation } from "../utils/queryOptions";

export const Route = createFileRoute("/contacts/new")({
  component: ContactNewComponent,
});

function ContactNewComponent() {
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const context = Route.useRouteContext();
  const navigate = Route.useNavigate();
  const router = useRouter();

  const createContact = useCreateContactMutation(context.auth);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
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

    createContact.mutate(validatedFields.data, {
      onSuccess: ({ contact }) => {
        void navigate({
          to: `/contacts/${contact.id}`,
          search: (old) => old,
        });
      },
    });
  };

  return (
    <form className="flex max-w-xl flex-col gap-4" onSubmit={onSubmit}>
      <EditForm
        errors={errors}
        isPending={createContact.isPending}
        back={() => router.history.back()}
      />
    </form>
  );
}

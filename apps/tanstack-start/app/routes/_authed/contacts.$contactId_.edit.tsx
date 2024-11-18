import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";

import { Contact } from "@contacts/server/db/schema";
import { UpdateContactSchema } from "@contacts/server/validation";
import { EditForm } from "@contacts/ui/components/Contact.Form";

import { useGetContactQueryOptions, useUpdateContactMutation } from "../../utils/queryOptions";

export const Route = createFileRoute("/_authed/contacts/$contactId_/edit")({
  loader: (opts) =>
    opts.context.queryClient.ensureQueryData(
      useGetContactQueryOptions(opts.context.auth.userId!, opts.params.contactId),
    ),
  component: ContactEditComponent,
});

function ContactEditComponent() {
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const params = Route.useParams();
  const context = Route.useRouteContext();
  const navigate = Route.useNavigate();
  const router = useRouter();

  const contactQuery = useSuspenseQuery(
    useGetContactQueryOptions(context.auth.userId!, params.contactId),
  );
  const { contact } = contactQuery.data;

  const updateContact = useUpdateContactMutation(
    context.queryClient,
    context.auth.userId!,
    params.contactId,
  );

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

    updateContact.mutate(validatedFields.data, {
      onSuccess: () => {
        void navigate({
          to: `/contacts/${params.contactId}`,
          search: (old) => old,
        });
      },
    });
  };

  return (
    <form className="flex max-w-xl flex-col gap-4" onSubmit={onSubmit}>
      <EditForm
        contact={contact as unknown as Contact}
        errors={errors}
        isPending={updateContact.isPending}
        back={() => router.history.back()}
      />
    </form>
  );
}

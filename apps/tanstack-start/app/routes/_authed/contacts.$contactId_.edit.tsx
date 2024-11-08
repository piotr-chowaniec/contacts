import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";

import { UpdateContactSchema } from "@contacts/server/validation";

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

  return (
    <form
      className="flex max-w-xl flex-col gap-4"
      onSubmit={async (event) => {
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
            navigate({
              to: `/contacts/${params.contactId}`,
              search: (old) => old,
            });
          },
        });
      }}
    >
      <div className="flex">
        <label htmlFor="firstName" className="w-24 pt-2">
          Name
        </label>
        <div className="mr-2 flex flex-1 flex-col gap-2">
          <input
            aria-label="First name"
            defaultValue={contact.firstName}
            id="firstName"
            name="firstName"
            placeholder="First"
            type="text"
            disabled={updateContact.isPending}
          />
          {errors?.firstName ? <em className="text-sm text-red-700">{errors.firstName}</em> : null}
        </div>
        <div className="ml-2 flex flex-1 flex-col gap-2">
          <input
            aria-label="Last name"
            defaultValue={contact.lastName}
            id="lastName"
            name="lastName"
            placeholder="Last"
            type="text"
            disabled={updateContact.isPending}
          />
          {errors?.lastName ? <em className="text-sm text-red-700">{errors.lastName}</em> : null}
        </div>
      </div>
      <div className="flex">
        <label htmlFor="email" className="w-24 pt-2">
          Email
        </label>
        <div className="flex flex-1 flex-col gap-2">
          <input
            defaultValue={contact.email}
            id="email"
            name="email"
            placeholder="some@email.com"
            type="email"
            disabled={updateContact.isPending}
          />
          {errors?.email ? <em className="text-sm text-red-700">{errors.email}</em> : null}
        </div>
      </div>
      <div className="flex">
        <label htmlFor="avatarUrl" className="w-24 pt-2">
          Avatar URL
        </label>
        <div className="flex flex-1 flex-col gap-2">
          <input
            aria-label="Avatar URL"
            defaultValue={contact.avatarUrl || ""}
            name="avatarUrl"
            placeholder="https://example.com/avatar.jpg"
            type="text"
            disabled={updateContact.isPending}
          />
          {errors?.avatarUrl ? <em className="text-sm text-red-700">{errors.avatarUrl}</em> : null}
        </div>
      </div>
      <div className="ml-24 flex gap-4">
        <button type="submit" className="w-28" disabled={updateContact.isPending}>
          {updateContact.isPending ? "Saving..." : "Save"}
        </button>
        <button
          type="button"
          className="w-24 text-inherit"
          disabled={updateContact.isPending}
          onClick={() => router.history.back()}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

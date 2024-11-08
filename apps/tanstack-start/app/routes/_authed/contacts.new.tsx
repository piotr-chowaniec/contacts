import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";

import { UpdateContactSchema } from "@contacts/server/validation";

import { useCreateContactMutation } from "../../utils/queryOptions";

export const Route = createFileRoute("/_authed/contacts/new")({
  component: ContactNewComponent,
});

function ContactNewComponent() {
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const context = Route.useRouteContext();
  const navigate = Route.useNavigate();
  const router = useRouter();

  const createContact = useCreateContactMutation(context.queryClient, context.auth.userId!);

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

        createContact.mutate(validatedFields.data, {
          onSuccess: ({ contact }) => {
            navigate({
              to: `/contacts/${contact.id}`,
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
            id="firstName"
            name="firstName"
            placeholder="First"
            type="text"
            disabled={createContact.isPending}
          />
          {errors?.firstName ? <em className="text-sm text-red-700">{errors.firstName}</em> : null}
        </div>
        <div className="ml-2 flex flex-1 flex-col gap-2">
          <input
            aria-label="Last name"
            id="lastName"
            name="lastName"
            placeholder="Last"
            type="text"
            disabled={createContact.isPending}
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
            id="email"
            name="email"
            placeholder="some@email.com"
            type="email"
            disabled={createContact.isPending}
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
            name="avatarUrl"
            placeholder="https://example.com/avatar.jpg"
            type="text"
            disabled={createContact.isPending}
          />
          {errors?.avatarUrl ? <em className="text-sm text-red-700">{errors.avatarUrl}</em> : null}
        </div>
      </div>
      <div className="ml-24 flex gap-4">
        <button type="submit" className="w-28" disabled={createContact.isPending}>
          {createContact.isPending ? "Saving..." : "Save"}
        </button>
        <button
          type="button"
          className="w-24 text-inherit"
          disabled={createContact.isPending}
          onClick={() => router.history.back()}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

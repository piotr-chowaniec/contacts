import { getAuth } from "@clerk/remix/ssr.server";
import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useActionData, useNavigate } from "@remix-run/react";

import { addContact } from "@contacts/server/queries";
import { UpdateContactSchema } from "@contacts/server/validation";

export const action = async (args: ActionFunctionArgs) => {
  const { userId } = await getAuth(args);
  if (!userId) {
    return redirect("/login");
  }

  const formData = await args.request.formData();
  const validatedFields = UpdateContactSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    avatarUrl: formData.get("avatarUrl"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Failed to create contact.",
    };
  }

  const createdContact = await addContact(userId, validatedFields.data);
  return redirect(`/contacts/${createdContact.id}`);
};

export default function NewContact() {
  const navigate = useNavigate();
  const actionData = useActionData<typeof action>();

  return (
    <Form method="post" className="flex max-w-xl flex-col gap-4">
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
          />
          {actionData?.errors?.firstName ? (
            <em className="text-sm text-red-700">{actionData?.errors.firstName}</em>
          ) : null}
        </div>
        <div className="ml-2 flex flex-1 flex-col gap-2">
          <input
            aria-label="Last name"
            id="lastName"
            name="lastName"
            placeholder="Last"
            type="text"
          />
          {actionData?.errors?.lastName ? (
            <em className="text-sm text-red-700">{actionData?.errors.lastName}</em>
          ) : null}
        </div>
      </div>
      <div className="flex">
        <label htmlFor="email" className="w-24 pt-2">
          Email
        </label>
        <div className="flex flex-1 flex-col gap-2">
          <input id="email" name="email" placeholder="some@email.com" type="email" />
          {actionData?.errors?.email ? (
            <em className="text-sm text-red-700">{actionData?.errors.email}</em>
          ) : null}
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
          />
          {actionData?.errors?.avatarUrl ? (
            <em className="text-sm text-red-700">{actionData?.errors.avatarUrl}</em>
          ) : null}
        </div>
      </div>
      <div className="ml-24 flex gap-4">
        <button type="submit">Save</button>
        <button type="button" className="text-inherit" onClick={() => navigate(-1)}>
          Cancel
        </button>
      </div>
    </Form>
  );
}

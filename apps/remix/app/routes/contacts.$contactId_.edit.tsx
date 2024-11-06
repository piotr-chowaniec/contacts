import { getAuth } from "@clerk/remix/ssr.server";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useFetcher, useLoaderData, useNavigate } from "@remix-run/react";

import { getContact, updateContact } from "@contacts/server/queries";
import { UpdateContactSchema } from "@contacts/server/validation";

export const action = async (args: ActionFunctionArgs) => {
  const { contactId } = args.params;
  if (!contactId) {
    throw new Error("Missing contactId param");
  }

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
      message: "Failed to update contact details.",
    };
  }

  await updateContact(userId, contactId, validatedFields.data);

  const url = new URL(args.request.url);
  const searchParams = url.searchParams.toString();

  return redirect(`/contacts/${contactId}?${searchParams}`);
};

export const loader = async (args: LoaderFunctionArgs) => {
  const { contactId } = args.params;
  if (!contactId) {
    throw new Error("Missing contactId param");
  }

  const { userId } = await getAuth(args);
  if (!userId) {
    return redirect("/login");
  }

  const contact = await getContact(userId, contactId);
  if (!contact) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ contact });
};

export default function EditContact() {
  const navigate = useNavigate();
  const { contact } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const fetcher = useFetcher();

  const isPending = fetcher?.state === "submitting";

  return (
    <fetcher.Form key={contact.id} method="post" className="flex max-w-xl flex-col gap-4">
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
            disabled={isPending}
          />
          {actionData?.errors?.firstName ? (
            <em className="text-sm text-red-700">{actionData?.errors.firstName}</em>
          ) : null}
        </div>
        <div className="ml-2 flex flex-1 flex-col gap-2">
          <input
            aria-label="Last name"
            defaultValue={contact.lastName}
            id="lastName"
            name="lastName"
            placeholder="Last"
            type="text"
            disabled={isPending}
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
          <input
            defaultValue={contact.email}
            id="email"
            name="email"
            placeholder="some@email.com"
            type="email"
            disabled={isPending}
          />
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
            defaultValue={contact.avatarUrl || ""}
            name="avatarUrl"
            placeholder="https://example.com/avatar.jpg"
            type="text"
            disabled={isPending}
          />
          {actionData?.errors?.avatarUrl ? (
            <em className="text-sm text-red-700">{actionData?.errors.avatarUrl}</em>
          ) : null}
        </div>
      </div>
      <div className="ml-24 flex gap-4">
        <button type="submit" className="w-24" disabled={isPending}>
          {isPending ? "Saving..." : "Save"}{" "}
        </button>
        <button
          type="button"
          className="w-24 text-inherit"
          disabled={isPending}
          onClick={() => navigate(-1)}
        >
          Cancel
        </button>
      </div>
    </fetcher.Form>
  );
}

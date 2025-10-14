import { getAuth } from "@clerk/remix/ssr.server";
import type { Contact } from "@contacts/server/db/schema";
import { getContact, updateContact } from "@contacts/server/queries";
import { UpdateContactSchema } from "@contacts/server/validation";
import { EditForm } from "@contacts/ui/components/Contact.Form";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useActionData, useFetcher, useLoaderData, useNavigate } from "@remix-run/react";

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
      <EditForm
        contact={contact as unknown as Contact}
        errors={actionData?.errors}
        isPending={isPending}
        back={() => navigate(-1)}
      />
    </fetcher.Form>
  );
}

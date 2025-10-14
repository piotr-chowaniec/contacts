import { getAuth } from "@clerk/remix/ssr.server";
import { addContact } from "@contacts/server/queries";
import { UpdateContactSchema } from "@contacts/server/validation";
import { EditForm } from "@contacts/ui/components/Contact.Form";
import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useActionData, useFetcher, useNavigate } from "@remix-run/react";

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

  const url = new URL(args.request.url);
  const searchParams = url.searchParams.toString();
  return redirect(`/contacts/${createdContact.id}?${searchParams}`);
};

export default function NewContact() {
  const navigate = useNavigate();
  const actionData = useActionData<typeof action>();
  const fetcher = useFetcher();
  const isPending = fetcher?.state === "submitting";

  return (
    <fetcher.Form method="post" className="flex max-w-xl flex-col gap-4">
      <EditForm errors={actionData?.errors} isPending={isPending} back={() => navigate(-1)} />
    </fetcher.Form>
  );
}

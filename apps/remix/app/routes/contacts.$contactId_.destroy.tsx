import { getAuth } from "@clerk/remix/ssr.server";
import { redirect, type ActionFunctionArgs } from "@remix-run/node";

import { deleteContact } from "@contacts/server/queries";

export const action = async (args: ActionFunctionArgs) => {
  const { contactId } = args.params;
  if (!contactId) {
    throw new Error("Missing contactId param");
  }

  const { userId } = await getAuth(args);
  if (!userId) {
    return redirect("/login");
  }

  await deleteContact(userId, contactId);

  const url = new URL(args.request.url);
  const searchParams = url.searchParams.toString();

  return redirect(`/contacts?${searchParams}`);
};

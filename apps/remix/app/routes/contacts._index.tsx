import { getAuth } from "@clerk/remix/ssr.server";
import { seedContacts } from "@contacts/server/queries";
import { type ActionFunctionArgs, redirect } from "@remix-run/node";
import { Form, useOutletContext } from "@remix-run/react";

export const action = async (args: ActionFunctionArgs) => {
  const { userId } = await getAuth(args);
  if (!userId) {
    return redirect("/login");
  }

  await seedContacts(userId);

  return {};
};

export default function ContactsIndex() {
  const context = useOutletContext();
  const noContacts = (context as { noContacts: boolean }).noContacts;

  return (
    <div className="flex w-full flex-col items-center pt-10">
      <p>This is Contacts index page.</p>
      <p>Select person from list, create new, play around with search and filters.</p>
      {noContacts && (
        <>
          <hr className="my-8 h-px w-2/6 border-0 bg-gray-700" />
          <p>You can also seed database with test data</p>
          <Form method="post" className="mt-2">
            <button type="submit">Seed database</button>
          </Form>
        </>
      )}
    </div>
  );
}

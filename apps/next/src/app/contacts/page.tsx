import { Suspense } from "react";
import { getMyContactsServerFn, seedContactsServerFn } from "~/server/queries";
import { SeedButton } from "~/ui/contacts-sidebar/contacts-seed-button";

import { RouteSpinner } from "@contacts/ui/components/Spinner";

export default function ContactsPage() {
  return (
    <Suspense fallback={<RouteSpinner />}>
      <ContactDefaultPage />
    </Suspense>
  );
}

async function ContactDefaultPage() {
  const { contacts } = await getMyContactsServerFn();

  const noContacts = !contacts.length;

  return (
    <div className="flex w-full flex-col items-center pt-10">
      <p>This is Contacts index page.</p>
      <p>Select person from list, create new, play around with search and filters.</p>
      {noContacts && (
        <>
          <hr className="my-8 h-px w-2/6 border-0 bg-gray-700" />
          <p>You can also seed database with test data</p>

          <form action={seedContactsServerFn}>
            <SeedButton />
          </form>
        </>
      )}
    </div>
  );
}

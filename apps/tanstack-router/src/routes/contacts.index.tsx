import { RouteSpinner } from "@contacts/ui/components/Spinner";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { useGetMyContactsQueryOptions, useSeedContactsMutation } from "../utils/queryOptions";

export const Route = createFileRoute("/contacts/")({
  component: ContactsIndexComponent,
  pendingComponent: RouteSpinner,
});

function ContactsIndexComponent() {
  const context = Route.useRouteContext();
  const contactsQuery = useSuspenseQuery(useGetMyContactsQueryOptions(context.auth));
  const noContacts = !contactsQuery.data.contacts.length;

  const seedContacts = useSeedContactsMutation(context.auth);

  return (
    <div className="flex w-full flex-col items-center pt-10">
      <p>This is Contacts index page.</p>
      <p>Select person from list, create new, play around with search and filters.</p>
      {noContacts && (
        <>
          <hr className="my-8 h-px w-2/6 border-0 bg-gray-700" />
          <p>You can also seed database with test data</p>

          <button
            type="button"
            className="mt-2"
            onClick={() => {
              seedContacts.mutate();
            }}
            disabled={seedContacts.isPending}
          >
            Seed database
          </button>
        </>
      )}
    </div>
  );
}

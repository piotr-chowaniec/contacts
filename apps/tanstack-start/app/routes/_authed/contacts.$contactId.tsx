import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { Contact } from "@contacts/server/db/schema";
import { ContactDetails } from "@contacts/ui/components/Contact.Details";
import { ContactError } from "@contacts/ui/components/Contact.Error";
import { ContactSkeleton } from "@contacts/ui/components/Contact.Skeleton";

import {
  useDeleteContactMutation,
  useGetContactQueryOptions,
  useUpdateContactMutation,
} from "../../utils/queryOptions";

export const Route = createFileRoute("/_authed/contacts/$contactId")({
  loader: (opts) =>
    opts.context.queryClient.ensureQueryData(
      useGetContactQueryOptions(opts.context.auth.userId!, opts.params.contactId),
    ),
  pendingComponent: ContactSkeleton,
  component: ContactComponent,
  errorComponent: ContactError,
});

function ContactComponent() {
  const params = Route.useParams();
  const context = Route.useRouteContext();
  const navigate = Route.useNavigate();

  const contactQuery = useSuspenseQuery(
    useGetContactQueryOptions(context.auth.userId!, params.contactId),
  );
  const contact = contactQuery.data.contact as Contact;

  const deleteContact = useDeleteContactMutation(
    context.queryClient,
    context.auth.userId!,
    params.contactId,
  );

  return (
    <ContactDetails contact={contact}>
      <Favorite contact={contact} />
      <button
        type="submit"
        onClick={() => {
          void navigate({
            to: `/contacts/${params.contactId}/edit`,
            search: (old) => old,
          });
        }}
      >
        Edit
      </button>
      <button
        type="submit"
        className="text-red-600"
        onClick={() => {
          const response = confirm("Please confirm you want to delete this contact.");

          if (!response) {
            return;
          }

          deleteContact.mutate();

          void navigate({
            to: "/contacts",
            search: (old) => old,
          });
        }}
      >
        Delete
      </button>
    </ContactDetails>
  );
}

const Favorite = ({ contact }: { contact: Contact }) => {
  const params = Route.useParams();
  const context = Route.useRouteContext();
  const updateContactFavorite = useUpdateContactMutation(
    context.queryClient,
    context.auth.userId!,
    params.contactId,
  );

  console.log(updateContactFavorite);

  const [isFavorite, setFavorite] = useState<boolean>(Boolean(contact.favorite));

  const handleFavoriteChange = () => {
    const newFavoriteStatus = !isFavorite;
    setFavorite(newFavoriteStatus);

    updateContactFavorite.mutate({
      firstName: contact.firstName,
      lastName: contact.lastName,
      email: contact.email,
      favorite: newFavoriteStatus,
    });
  };

  return (
    <button
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      name="favorite"
      value={isFavorite ? "false" : "true"}
      className={`bg-transparent p-0 text-2xl shadow-none ${isFavorite ? "text-yellow-400" : "text-neutral-400"} hover:text-yellow-400 hover:shadow-none`}
      onClick={() => {
        handleFavoriteChange();
      }}
    >
      {isFavorite ? "★" : "☆"}
    </button>
  );
};

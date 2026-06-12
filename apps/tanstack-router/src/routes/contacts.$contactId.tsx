import {
  useDeleteContactMutation,
  useFavoriteContactMutation,
  useGetContactQueryOptions,
} from "@contacts/queries";
import type { Contact } from "@contacts/server/db/schema";
import { ContactDetails } from "@contacts/ui/components/Contact.Details";
import { ContactError } from "@contacts/ui/components/Contact.Error";
import { ContactImage } from "@contacts/ui/components/Contact.Image";
import { ContactSkeleton } from "@contacts/ui/components/Contact.Skeleton";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/contacts/$contactId")({
  loader: (opts) =>
    opts.context.queryClient.ensureQueryData(
      useGetContactQueryOptions(opts.context.auth, opts.params.contactId)
    ),
  pendingComponent: ContactSkeleton,
  component: ContactComponent,
  errorComponent: ContactError,
});

function ContactComponent() {
  const params = Route.useParams();
  const context = Route.useRouteContext();
  const navigate = Route.useNavigate();

  const contactQuery = useSuspenseQuery(useGetContactQueryOptions(context.auth, params.contactId));
  const { contact } = contactQuery.data;

  const deleteContact = useDeleteContactMutation(context.auth, params.contactId);

  return (
    <ContactDetails
      contact={contact}
      ContactImage={<ContactImage contact={contact} />}
      Favorite={<Favorite contact={contact} />}
      EditButton={
        <button
          type="button"
          onClick={() => {
            void navigate({
              to: `/contacts/${params.contactId}/edit`,
              search: (old) => old,
            });
          }}
        >
          Edit
        </button>
      }
      DeleteButton={
        <button
          type="button"
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
      }
    />
  );
}

const Favorite = ({ contact }: { contact: Contact }) => {
  const params = Route.useParams();
  const context = Route.useRouteContext();
  const favoriteContact = useFavoriteContactMutation(context.auth, params.contactId);

  const [isFavorite, setFavorite] = useState<boolean>(Boolean(contact.favorite));

  const handleFavoriteChange = () => {
    const newFavoriteStatus = !isFavorite;
    setFavorite(newFavoriteStatus);

    favoriteContact.mutate({ favorite: newFavoriteStatus });
  };

  return (
    <button
      type="button"
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

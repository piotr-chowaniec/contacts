import { useAuth } from "@clerk/react";
import {
  useDeleteContactMutation,
  useFavoriteContactMutation,
  useGetContactQueryOptions,
} from "@contacts/queries";
import type { Contact } from "@contacts/server/db/schema";
import { ContactDetails } from "@contacts/ui/components/Contact.Details";
import { ContactImage } from "@contacts/ui/components/Contact.Image";
import { ContactSkeleton } from "@contacts/ui/components/Contact.Skeleton";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";

export function ContactDetail() {
  return (
    <Suspense fallback={<ContactSkeleton />}>
      <ContactDetailInner />
    </Suspense>
  );
}

function ContactDetailInner() {
  const { contactId = "" } = useParams();
  const auth = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const search = searchParams.toString();

  const contactQuery = useSuspenseQuery(useGetContactQueryOptions(auth, contactId));
  const { contact } = contactQuery.data;

  const deleteContact = useDeleteContactMutation(auth, contactId);

  const withSearch = (pathname: string) => (search ? `${pathname}?${search}` : pathname);

  return (
    <ContactDetails
      contact={contact}
      ContactImage={<ContactImage contact={contact} />}
      Favorite={<Favorite contact={contact} />}
      EditButton={
        <button type="button" onClick={() => navigate(withSearch(`/contacts/${contactId}/edit`))}>
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

            void navigate(withSearch("/contacts"));
          }}
        >
          Delete
        </button>
      }
    />
  );
}

const Favorite = ({ contact }: { contact: Contact }) => {
  const auth = useAuth();
  const favoriteContact = useFavoriteContactMutation(auth, contact.id);

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

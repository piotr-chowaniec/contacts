"use client";

import { useOptimistic } from "react";
import { getQueryClient } from "~/get-query-client";
import { updateContactServerFn } from "~/server/queries";

import { Contact } from "@contacts/server/db/schema";

export function Favorite({ contact }: { contact: Contact }) {
  const queryClient = getQueryClient();

  const [optimisticContact, changeOptimisticContact] = useOptimistic<Contact, boolean>(
    contact,
    (state, newFavorite) => ({ ...state, favorite: newFavorite }),
  );

  const handleFavoriteChange = async () => {
    const newFavorite = Boolean(!optimisticContact.favorite);
    changeOptimisticContact(newFavorite);

    await updateContactServerFn(contact.id, {
      firstName: contact.firstName,
      lastName: contact.lastName,
      email: contact.email,
      favorite: newFavorite,
    });

    await queryClient.invalidateQueries({
      queryKey: ["contact"],
    });
  };

  const isFavorite = optimisticContact.favorite;

  return (
    <form action={handleFavoriteChange}>
      <button
        type="submit"
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        name="favorite"
        value={isFavorite ? "false" : "true"}
        className={`bg-transparent p-0 text-2xl shadow-none ${isFavorite ? "text-yellow-400" : "text-neutral-400"} hover:text-yellow-400 hover:shadow-none`}
      >
        {isFavorite ? "★" : "☆"}
      </button>
    </form>
  );
}

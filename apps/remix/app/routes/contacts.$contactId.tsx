import { getAuth } from "@clerk/remix/ssr.server";
import { json, redirect } from "@remix-run/node";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Form, useFetcher, useLoaderData } from "@remix-run/react";
import type { FunctionComponent } from "react";

import { getContact, updateContactFavorite } from "@contacts/server/queries";
import avatarFallback from "@contacts/ui/assets/images/avatar-fallback.png";

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

  return updateContactFavorite(userId, contactId, {
    favorite: formData.get("favorite") === "true",
  });
};

export default function Contact() {
  const { contact } = useLoaderData<typeof loader>();

  return (
    <div className="flex gap-10">
      <div className="h-60 w-60 overflow-hidden rounded-3xl bg-white">
        <img
          alt={`${contact.firstName} ${contact.lastName} avatar`}
          key={contact.avatarUrl || "fallback"}
          src={contact.avatarUrl || avatarFallback}
        />
      </div>

      <div className="flex flex-col gap-6">
        <h1 className="align-center flex gap-4 text-3xl font-bold">
          {contact.firstName || contact.lastName ? (
            <>
              {contact.firstName} {contact.lastName}
            </>
          ) : (
            <i>No Name</i>
          )}{" "}
          <Favorite isFavorite={Boolean(contact.favorite)} />
        </h1>

        {contact.email ? (
          <a href={`mailto: ${contact.email}`} className="text-blue-700">
            {contact.email}
          </a>
        ) : null}

        <div className="flex gap-4">
          <Form action="edit">
            <button type="submit">Edit</button>
          </Form>

          <Form
            action="destroy"
            method="post"
            onSubmit={(event) => {
              const response = confirm("Please confirm you want to delete this contact.");

              if (!response) {
                event.preventDefault();
              }
            }}
          >
            <button type="submit" className="text-red-600">
              Delete
            </button>
          </Form>
        </div>
      </div>
    </div>
  );
}

const Favorite: FunctionComponent<{
  isFavorite: boolean;
}> = ({ isFavorite }) => {
  const fetcher = useFetcher();
  const favorite = fetcher.formData ? fetcher.formData.get("favorite") === "true" : isFavorite;

  return (
    <fetcher.Form method="post">
      <button
        aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
        name="favorite"
        value={favorite ? "false" : "true"}
        className={`bg-transparent p-0 text-2xl shadow-none ${favorite ? "text-yellow-400" : "text-neutral-400"} hover:text-yellow-400 hover:shadow-none`}
      >
        {favorite ? "★" : "☆"}
      </button>
    </fetcher.Form>
  );
};

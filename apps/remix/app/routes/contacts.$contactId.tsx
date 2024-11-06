import { getAuth } from "@clerk/remix/ssr.server";
import { defer, redirect } from "@remix-run/node";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import {
  Await,
  Form,
  useAsyncValue,
  useFetcher,
  useLoaderData,
  useLocation,
  useNavigate,
  useParams,
} from "@remix-run/react";
import { Suspense, type FunctionComponent } from "react";

import type { Contact } from "@contacts/server/db/schema";
import { getContact, updateContactFavorite } from "@contacts/server/queries";
import { ContactDetails } from "@contacts/ui/components/Contact.Details";
import { ContactError } from "@contacts/ui/components/Contact.Error";
import { ContactSkeleton } from "@contacts/ui/components/Contact.Skeleton";

export const loader = async (args: LoaderFunctionArgs) => {
  const { contactId } = args.params;
  if (!contactId) {
    throw new Error("Missing contactId param");
  }

  const { userId } = await getAuth(args);
  if (!userId) {
    return redirect("/login");
  }

  const contactPromise = getContact(userId, contactId);

  return defer({ contactPromise });
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
  const { contactId } = useParams();
  const { contactPromise } = useLoaderData<typeof loader>();

  return (
    <Suspense key={contactId} fallback={<ContactSkeleton />}>
      <Await resolve={contactPromise} errorElement={<ContactError />}>
        <ContactDetailsWrapper />
      </Await>
    </Suspense>
  );
}

const ContactDetailsWrapper = () => {
  const contact = useAsyncValue() as Contact;
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <ContactDetails contact={contact}>
      <Favorite isFavorite={Boolean(contact.favorite)} />
      <button onClick={() => navigate(`edit${location.search}`)}>Edit</button>
      <Form
        action={`destroy${location.search}`}
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
    </ContactDetails>
  );
};

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

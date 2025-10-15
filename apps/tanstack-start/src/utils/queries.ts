import { auth } from "@clerk/tanstack-react-start/server";
import {
  addContact,
  deleteContact,
  getContact,
  getMyContacts,
  seedContacts,
  updateContact,
} from "@contacts/server/queries";
import type { UpdateContact } from "@contacts/server/validation";
import { redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

const ensureAuthenticated = async () => {
  const { userId } = await auth();
  if (!userId) {
    throw redirect({ to: "/login" });
  }
  return userId;
};

export const getMyContactsServerFn = createServerFn({ method: "GET" })
  .inputValidator((d: { q?: string }) => d)
  .handler(async ({ data: { q } }) => {
    const userId = await ensureAuthenticated();
    const contacts = await getMyContacts(userId, q);
    return { contacts };
  });

export const getContactServerFn = createServerFn({ method: "GET" })
  .inputValidator((d: { contactId: string }) => d)
  .handler(async ({ data: { contactId } }) => {
    const userId = await ensureAuthenticated();
    const contact = await getContact(userId, contactId);
    return { contact };
  });

export const createContactServerFn = createServerFn({ method: "POST" })
  .inputValidator((d: { data: UpdateContact }) => d)
  .handler(async ({ data: { data } }) => {
    const userId = await ensureAuthenticated();
    const contact = await addContact(userId, data);
    return { contact };
  });

export const updateContactServerFn = createServerFn({ method: "POST" })
  .inputValidator((d: { contactId: string; data: UpdateContact }) => d)
  .handler(async ({ data: { contactId, data } }) => {
    try {
      const userId = await ensureAuthenticated();
      const contact = await updateContact(userId, contactId, data);
      return { contact };
    } catch (e) {
      console.log(e);
    }
  });

export const deleteContactServerFn = createServerFn({ method: "POST" })
  .inputValidator((d: { contactId: string }) => d)
  .handler(async ({ data: { contactId } }) => {
    const userId = await ensureAuthenticated();
    await deleteContact(userId, contactId);
    return;
  });

export const seedContactsServerFn = createServerFn({ method: "POST" }).handler(async () => {
  const userId = await ensureAuthenticated();
  await seedContacts(userId);
  return;
});

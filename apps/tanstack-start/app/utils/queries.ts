import { createServerFn } from "@tanstack/start";

import {
  getMyContacts,
  addContact,
  seedContacts,
  getContact,
  updateContact,
  deleteContact,
} from "@contacts/server/queries";
import { UpdateContact } from "@contacts/server/validation";

export const getMyContactsServerFn = createServerFn({ method: "GET" })
  .validator((d: { userId: string; q?: string }) => d)
  .handler(async ({ data: { userId, q } }) => {
    const contacts = await getMyContacts(userId, q);
    return { contacts };
  });

export const getContactServerFn = createServerFn({ method: "GET" })
  .validator((d: { userId: string; contactId: string }) => d)
  .handler(async ({ data: { userId, contactId } }) => {
    const contact = await getContact(userId, contactId);
    return { contact };
  });

export const createContactServerFn = createServerFn({ method: "POST" })
  .validator((d: { userId: string; data: UpdateContact }) => d)
  .handler(async ({ data: { userId, data } }) => {
    const contact = await addContact(userId, data);
    return { contact };
  });

export const updateContactServerFn = createServerFn({ method: "POST" })
  .validator((d: { userId: string; contactId: string; data: UpdateContact }) => d)
  .handler(async ({ data: { userId, contactId, data } }) => {
    try {
      const contact = await updateContact(userId, contactId, data);
      return { contact };
    } catch (e) {
      console.log(e);
    }
  });

export const deleteContactServerFn = createServerFn({ method: "POST" })
  .validator((d: { userId: string; contactId: string }) => d)
  .handler(async ({ data: { userId, contactId } }) => {
    await deleteContact(userId, contactId);
    return;
  });

export const seedContactsServerFn = createServerFn({ method: "POST" })
  .validator((d: { userId: string }) => d)
  .handler(async ({ data: { userId } }) => {
    await seedContacts(userId);
    return;
  });

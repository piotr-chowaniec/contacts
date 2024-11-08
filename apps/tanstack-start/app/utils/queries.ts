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

export const getMyContactsServerFn = createServerFn(
  "GET",
  async ({ userId, q }: { userId: string; q?: string }) => {
    const contacts = await getMyContacts(userId, q);
    return { contacts };
  },
);

export const getContactServerFn = createServerFn(
  "GET",
  async ({ userId, contactId }: { userId: string; contactId: string }) => {
    const contact = await getContact(userId, contactId);
    return { contact };
  },
);

export const createContactServerFn = createServerFn(
  "POST",
  async ({ userId, data }: { userId: string; data: UpdateContact }) => {
    const contact = await addContact(userId, data);
    return { contact };
  },
);

export const updateContactServerFn = createServerFn(
  "POST",
  async ({
    userId,
    contactId,
    data,
  }: {
    userId: string;
    contactId: string;
    data: UpdateContact;
  }) => {
    try {
      const contact = await updateContact(userId, contactId, data);
      return { contact };
    } catch (e) {
      console.log(e);
    }
  },
);

export const deleteContactServerFn = createServerFn(
  "POST",
  async ({ userId, contactId }: { userId: string; contactId: string }) => {
    await deleteContact(userId, contactId);
    return;
  },
);

export const seedContactsServerFn = createServerFn(
  "POST",
  async ({ userId }: { userId: string }) => {
    await seedContacts(userId);
    return;
  },
);

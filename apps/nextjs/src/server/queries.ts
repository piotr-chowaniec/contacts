"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import {
  getMyContacts,
  addContact,
  seedContacts,
  getContact,
  updateContact,
  deleteContact,
} from "@contacts/server/queries";
import { UpdateContact } from "@contacts/server/validation";

export async function getMyContactsServerFn(q?: string) {
  const user = auth();

  if (!user.userId) throw new Error("Unauthorized");

  const contacts = await getMyContacts(user.userId, q);
  return { contacts };
}

export async function getContactServerFn(contactId: string) {
  const user = auth();

  if (!user.userId) throw new Error("Unauthorized");

  const contact = await getContact(user.userId, contactId);
  return { contact };
}

export async function createContactServerFn(data: UpdateContact) {
  const user = auth();

  if (!user.userId) throw new Error("Unauthorized");

  const contact = await addContact(user.userId, data);

  revalidatePath("/contacts");

  return { contact };
}

export async function updateContactServerFn(contactId: string, data: UpdateContact) {
  const user = auth();

  if (!user.userId) throw new Error("Unauthorized");

  const contact = await updateContact(user.userId, contactId, data);

  revalidatePath("/contacts");

  return { contact };
}

export async function deleteContactServerFn(contactId: string) {
  const user = auth();

  if (!user.userId) throw new Error("Unauthorized");

  await deleteContact(user.userId, contactId);

  revalidatePath("/contacts");
}

export async function seedContactsServerFn() {
  const user = auth();

  if (!user.userId) throw new Error("Unauthorized");

  await seedContacts(user.userId);

  revalidatePath("/contacts");
}

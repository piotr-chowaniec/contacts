"use server";

import { auth } from "@clerk/nextjs/server";
import {
  addContact,
  deleteContact,
  getContact,
  getMyContacts,
  seedContacts,
  updateContact,
} from "@contacts/server/queries";
import type { UpdateContact } from "@contacts/server/validation";
import { revalidatePath } from "next/cache";

export async function getMyContactsServerFn(q?: string) {
  const user = await auth();

  if (!user.userId) throw new Error("Unauthorized");

  const contacts = await getMyContacts(user.userId, q);
  return { contacts };
}

export async function getContactServerFn(contactId: string) {
  const user = await auth();

  if (!user.userId) throw new Error("Unauthorized");

  const contact = await getContact(user.userId, contactId);
  return { contact };
}

export async function createContactServerFn(data: UpdateContact) {
  const user = await auth();

  if (!user.userId) throw new Error("Unauthorized");

  const contact = await addContact(user.userId, data);

  revalidatePath("/contacts");

  return { contact };
}

export async function updateContactServerFn(contactId: string, data: UpdateContact) {
  const user = await auth();

  if (!user.userId) throw new Error("Unauthorized");

  const contact = await updateContact(user.userId, contactId, data);

  revalidatePath("/contacts");

  return { contact };
}

export async function deleteContactServerFn(contactId: string) {
  const user = await auth();

  if (!user.userId) throw new Error("Unauthorized");

  await deleteContact(user.userId, contactId);

  revalidatePath("/contacts");
}

export async function seedContactsServerFn() {
  const user = await auth();

  if (!user.userId) throw new Error("Unauthorized");

  await seedContacts(user.userId);

  revalidatePath("/contacts");
}

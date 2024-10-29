import { and, eq } from "drizzle-orm";

import { db } from "./db";
import { contacts } from "./db/schema";
import { TEST_CONTACTS } from "./db/seed";
import { UpdateContact, UpdateContactFavorite } from "./validation";

export async function getMyContacts(userId: string, query?: string | null) {
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 500));

  if (query) {
    const contacts = await db.query.contacts.findMany({
      where: (model, { and, or, eq, ilike }) =>
        and(
          eq(model.userId, userId),
          or(
            ilike(model.firstName, query),
            ilike(model.lastName, query),
            ilike(model.email, query),
          ),
        ),
      orderBy: (model, { desc }) => desc(model.id),
    });

    return contacts;
  }

  const contacts = await db.query.contacts.findMany({
    where: (model, { eq }) => eq(model.userId, userId),
    orderBy: (model, { desc }) => desc(model.id),
  });

  return contacts;
}

export async function getContact(userId: string, id: string) {
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 500));

  if (!userId) throw new Error("Unauthorized");

  const contact = await db.query.contacts.findFirst({
    where: (model, { eq }) => eq(model.id, id),
  });

  if (!contact) throw new Error("Contact not found");

  if (contact.userId !== userId) throw new Error("Unauthorized");

  return contact;
}

export async function addContact(userId: string, data: UpdateContact) {
  const [createdContact] = await db
    .insert(contacts)
    .values({
      ...data,
      userId,
    })
    .returning();

  return createdContact;
}

export async function updateContact(userId: string, id: string, updates: UpdateContact) {
  const [updatedContact] = await db
    .update(contacts)
    .set(updates)
    .where(and(eq(contacts.id, id), eq(contacts.userId, userId)))
    .returning();

  return updatedContact;
}

export async function updateContactFavorite(
  userId: string,
  id: string,
  updates: UpdateContactFavorite,
) {
  const [updatedContact] = await db
    .update(contacts)
    .set(updates)
    .where(and(eq(contacts.id, id), eq(contacts.userId, userId)))
    .returning();

  return updatedContact;
}

export async function deleteContact(userId: string, id: string) {
  await db.delete(contacts).where(and(eq(contacts.id, id), eq(contacts.userId, userId)));
}

export async function seedContacts(userId: string) {
  await db
    .insert(contacts)
    .values(TEST_CONTACTS.map((contact) => ({ ...contact, userId })))
    .execute();
}

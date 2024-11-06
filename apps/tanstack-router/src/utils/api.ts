import { Contact } from "@contacts/server/db/schema";
import { UpdateContact } from "@contacts/server/validation";

import { Auth } from "./auth";

export const getMyContacts = (auth: Auth, q?: string) => async () => {
  const token = await auth.getToken();
  const url = `${import.meta.env.VITE_API_URL}/contact` + (q ? `?q=${q}` : "");
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch contacts");
  }

  const { contacts } = (await response.json()) as { contacts: Contact[] };

  return {
    contacts,
  };
};

export const createContact = (auth: Auth) => async (updates: UpdateContact) => {
  const token = await auth.getToken();
  const response = await fetch(`${import.meta.env.VITE_API_URL}/contact`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    throw new Error("Failed to create contact");
  }

  const { contact } = (await response.json()) as { contact: Contact };

  return {
    contact,
  };
};

export const getContact = (auth: Auth, contactId: string) => async () => {
  const token = await auth.getToken();
  const response = await fetch(`${import.meta.env.VITE_API_URL}/contact/${contactId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch contact");
  }

  const { contact } = (await response.json()) as { contact: Contact };

  return {
    contact,
  };
};

export const updateContact = (auth: Auth, contactId: string) => async (updates: UpdateContact) => {
  const token = await auth.getToken();
  const response = await fetch(`${import.meta.env.VITE_API_URL}/contact/${contactId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    throw new Error("Failed to update contact");
  }

  const { contact } = (await response.json()) as { contact: Contact };

  return {
    contact,
  };
};

export const deleteContact = (auth: Auth, contactId: string) => async () => {
  const token = await auth.getToken();
  const response = await fetch(`${import.meta.env.VITE_API_URL}/contact/${contactId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete contact");
  }

  return;
};

export const seedContacts = (auth: Auth) => async () => {
  const token = await auth.getToken();
  const response = await fetch(`${import.meta.env.VITE_API_URL}/contact/seed`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to seed contacts");
  }

  return;
};

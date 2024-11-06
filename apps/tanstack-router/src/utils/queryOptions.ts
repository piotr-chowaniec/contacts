import { queryOptions, useMutation } from "@tanstack/react-query";

import { queryClient } from "../main";

import {
  createContact,
  deleteContact,
  getContact,
  getMyContacts,
  seedContacts,
  updateContact,
} from "./api";
import { Auth } from "./auth";

export const useGetMyContactsQueryOptions = (auth: Auth, q?: string) => {
  return queryOptions({
    queryKey: q ? ["contact", q] : ["contact"],
    queryFn: getMyContacts(auth, q),
  });
};

export const useGetContactQueryOptions = (auth: Auth, contactId: string) =>
  queryOptions({
    queryKey: ["contact", contactId],
    queryFn: getContact(auth, contactId),
  });

export const useCreateContactMutation = (auth: Auth) =>
  useMutation({
    mutationKey: ["contact", "create"],
    mutationFn: createContact(auth),
    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: ["contact"],
      }),
  });

export const useUpdateContactMutation = (auth: Auth, contactId: string) =>
  useMutation({
    mutationKey: ["contact", "update", contactId],
    mutationFn: updateContact(auth, contactId),
    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: ["contact"],
      }),
  });

export const useDeleteContactMutation = (auth: Auth, contactId: string) =>
  useMutation({
    mutationKey: ["contact", "delete", contactId],
    mutationFn: deleteContact(auth, contactId),
    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: ["contact"],
      }),
  });

export const useSeedContactsMutation = (auth: Auth) =>
  useMutation({
    mutationKey: ["contact", "seed"],
    mutationFn: seedContacts(auth),
    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: ["contact"],
      }),
  });

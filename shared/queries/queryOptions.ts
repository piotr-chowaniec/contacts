import { queryOptions, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createContact,
  deleteContact,
  getContact,
  getMyContacts,
  seedContacts,
  updateContact,
} from "./api";
import type { Auth } from "./auth";

export const useGetMyContactsQueryOptions = (auth: Auth, q?: string) => {
  return queryOptions({
    queryKey: q ? [auth.userId, "contact", q] : [auth.userId, "contact"],
    queryFn: getMyContacts(auth, q),
  });
};

export const useGetContactQueryOptions = (auth: Auth, contactId: string) =>
  queryOptions({
    queryKey: [auth.userId, "contact", contactId],
    queryFn: getContact(auth, contactId),
  });

export const useCreateContactMutation = (auth: Auth) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [auth.userId, "contact", "create"],
    mutationFn: createContact(auth),
    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: [auth.userId, "contact"],
      }),
  });
};

export const useUpdateContactMutation = (auth: Auth, contactId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [auth.userId, "contact", "update", contactId],
    mutationFn: updateContact(auth, contactId),
    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: [auth.userId, "contact"],
      }),
  });
};

export const useDeleteContactMutation = (auth: Auth, contactId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [auth.userId, "contact", "delete", contactId],
    mutationFn: deleteContact(auth, contactId),
    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: [auth.userId, "contact"],
      }),
  });
};

export const useSeedContactsMutation = (auth: Auth) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [auth.userId, "contact", "seed"],
    mutationFn: seedContacts(auth),
    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: [auth.userId, "contact"],
      }),
  });
};

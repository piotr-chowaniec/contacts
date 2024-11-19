import { QueryClient, queryOptions, useMutation } from "@tanstack/react-query";

import { UpdateContact } from "@contacts/server/validation";

import {
  getMyContactsServerFn,
  createContactServerFn,
  seedContactsServerFn,
  getContactServerFn,
  updateContactServerFn,
  deleteContactServerFn,
} from "./queries";

export const useGetMyContactsQueryOptions = (userId: string, q?: string) => {
  return queryOptions({
    queryKey: q ? [userId, "contact", q] : [userId, "contact"],
    queryFn: () => getMyContactsServerFn({ userId, q }),
  });
};

export const useGetContactQueryOptions = (userId: string, contactId: string) =>
  queryOptions({
    queryKey: [userId, "contact", contactId],
    queryFn: () => getContactServerFn({ userId, contactId }),
  });

export const useCreateContactMutation = (queryClient: QueryClient, userId: string) =>
  useMutation({
    mutationKey: [userId, "contact", "create"],
    mutationFn: (data: UpdateContact) => createContactServerFn({ userId, data }),
    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: [userId, "contact"],
      }),
  });

export const useUpdateContactMutation = (
  queryClient: QueryClient,
  userId: string,
  contactId: string,
) =>
  useMutation({
    mutationKey: [userId, "contact", "update", contactId],
    mutationFn: (data: UpdateContact) => updateContactServerFn({ userId, contactId, data }),
    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: [userId, "contact"],
      }),
  });

export const useDeleteContactMutation = (
  queryClient: QueryClient,
  userId: string,
  contactId: string,
) =>
  useMutation({
    mutationKey: [userId, "contact", "delete", contactId],
    mutationFn: () => deleteContactServerFn({ userId, contactId }),
    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: ["contact"],
      }),
  });

export const useSeedContactsMutation = (queryClient: QueryClient, userId: string) =>
  useMutation({
    mutationKey: [userId, "contact", "seed"],
    mutationFn: () => seedContactsServerFn({ userId }),
    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: [userId, "contact"],
      }),
  });

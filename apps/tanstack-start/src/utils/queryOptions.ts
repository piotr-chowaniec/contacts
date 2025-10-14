import type { UpdateContact } from "@contacts/server/validation";
import { type QueryClient, queryOptions, useMutation } from "@tanstack/react-query";

import {
  createContactServerFn,
  deleteContactServerFn,
  getContactServerFn,
  getMyContactsServerFn,
  seedContactsServerFn,
  updateContactServerFn,
} from "./queries";

export const useGetMyContactsQueryOptions = (userId: string, q?: string) => {
  return queryOptions({
    queryKey: q ? [userId, "contact", q] : [userId, "contact"],
    queryFn: () => getMyContactsServerFn({ data: { q } }),
  });
};

export const useGetContactQueryOptions = (userId: string, contactId: string) =>
  queryOptions({
    queryKey: [userId, "contact", contactId],
    queryFn: () => getContactServerFn({ data: { contactId } }),
  });

export const useCreateContactMutation = (queryClient: QueryClient, userId: string) =>
  useMutation({
    mutationKey: [userId, "contact", "create"],
    mutationFn: (data: UpdateContact) => createContactServerFn({ data: { data } }),
    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: [userId, "contact"],
      }),
  });

export const useUpdateContactMutation = (
  queryClient: QueryClient,
  userId: string,
  contactId: string
) =>
  useMutation({
    mutationKey: [userId, "contact", "update", contactId],
    mutationFn: (data: UpdateContact) => updateContactServerFn({ data: { contactId, data } }),
    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: [userId, "contact"],
      }),
  });

export const useDeleteContactMutation = (
  queryClient: QueryClient,
  userId: string,
  contactId: string
) =>
  useMutation({
    mutationKey: [userId, "contact", "delete", contactId],
    mutationFn: () => deleteContactServerFn({ data: { contactId } }),
    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: ["contact"],
      }),
  });

export const useSeedContactsMutation = (queryClient: QueryClient, userId: string) =>
  useMutation({
    mutationKey: [userId, "contact", "seed"],
    mutationFn: () => seedContactsServerFn(),
    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: [userId, "contact"],
      }),
  });

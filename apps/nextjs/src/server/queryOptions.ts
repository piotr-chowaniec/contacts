import { queryOptions } from "@tanstack/react-query";

import { getContactServerFn, getMyContactsServerFn } from "./queries";

export const useGetMyContactsQueryOptions = (q?: string) =>
  queryOptions({
    queryKey: q ? ["contact", q] : ["contact"],
    queryFn: () => getMyContactsServerFn(q),
  });

export const useGetContactQueryOptions = (contactId: string) =>
  queryOptions({
    queryKey: ["contact", contactId],
    queryFn: () => getContactServerFn(contactId),
  });

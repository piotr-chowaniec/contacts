export {
  createContact,
  deleteContact,
  getContact,
  getMyContacts,
  seedContacts,
  updateContact,
} from "./api";
export type { Auth } from "./auth";
export {
  useCreateContactMutation,
  useDeleteContactMutation,
  useGetContactQueryOptions,
  useGetMyContactsQueryOptions,
  useSeedContactsMutation,
  useUpdateContactMutation,
} from "./queryOptions";

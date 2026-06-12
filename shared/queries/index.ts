export {
  createContact,
  deleteContact,
  getContact,
  getMyContacts,
  seedContacts,
  updateContact,
  updateContactFavorite,
} from "./api";
export type { Auth } from "./auth";
export {
  useCreateContactMutation,
  useDeleteContactMutation,
  useFavoriteContactMutation,
  useGetContactQueryOptions,
  useGetMyContactsQueryOptions,
  useSeedContactsMutation,
  useUpdateContactMutation,
} from "./queryOptions";

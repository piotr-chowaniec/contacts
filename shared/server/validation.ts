import { z } from "zod";

export const UpdateContactSchema = z.object({
  firstName: z.string().trim().min(3),
  lastName: z.string().trim().min(3),
  email: z.string().email(),
  avatarUrl: z.string().url().optional().or(z.literal("")),
});
export type UpdateContact = z.infer<typeof UpdateContactSchema>;

export const UpdateContactFavoriteSchema = z.object({
  favorite: z.boolean(),
});
export type UpdateContactFavorite = z.infer<typeof UpdateContactFavoriteSchema>;

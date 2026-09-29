import { z } from "zod";
export const ClientZodSchema = z.object({
  id: z
    .uuid({ error: "Client ID is required" })
    .min(1, "Client ID is required"),
  name: z
    .string({ error: "Client name is required" })
    .min(1, "Client name is required"),
  address: z.string().nullable().optional(),
  contact: z
    .string({ error: "Client contact is required" })
    .min(1, "Client contact is required"),
  userId: z
    .uuid({ error: "User ID is required" })
    .min(1, "User ID is required"),
});

export const RegisterClientZodSchema = ClientZodSchema.omit({
  id: true,
  userId: true,
});
export const EditClientZodSchema = z
  .object(RegisterClientZodSchema.shape, {
    error: (issue) => {
      if (issue.input === undefined) {
        return "At least one field is required for editing client";
      }
      return undefined; // Use Zod's default message otherwise
    },
  })
  .partial();
export const GetClientZodSchema = ClientZodSchema.pick({
  id: true,
});
export const GetClientListZodSchema = z.object({
  page: z.number().int().optional(),
  search: z.string().optional(),
});

export type Client = z.infer<typeof ClientZodSchema>;
export type RegisterClient = z.infer<typeof RegisterClientZodSchema>;
export type EditClient = z.infer<typeof EditClientZodSchema>;
export type GetClient = z.infer<typeof GetClientZodSchema>;

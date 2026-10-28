import { z } from "zod";

const clientName = z
  .string({ error: "Client name is required" })
  .trim()
  .min(1, "Client name is required");
const clientAddress = z.string().trim().min(1, "Client address is required");
const clientContact = z
  .string({ error: "Client contact is required" })
  .trim()
  .min(1, "Client contact is required");

export const ClientZodSchema = z.object({
  id: z
    .uuid({ error: "Client ID is required" })
    .min(1, "Client ID is required"),
  name: clientName,
  address: clientAddress.nullable().optional(),
  contact: clientContact,
  userId: z
    .uuid({ error: "User ID is required" })
    .min(1, "User ID is required"),
}).strict();

export const ClientResponseZodSchema = z
  .object({
    id: z.uuid(),
    name: z.string(),
    address: z.string().nullable(),
    contact: z.string(),
    userId: z.uuid(),
  })
  .strict()
  .meta({ id: "ClientResponse" });

export const ClientListResponseZodSchema = z.object({
  totalPages: z.number().int().positive(),
  clients: z.array(ClientResponseZodSchema),
}).strict().meta({ id: "ClientListResponse" });

export const RegisterClientZodSchema = ClientZodSchema.omit({
  id: true,
  userId: true,
});
export const EditClientZodSchema = RegisterClientZodSchema.partial()
  .strict()
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field is required for editing client",
  });
export const GetClientZodSchema = ClientZodSchema.pick({
  id: true,
});

export type Client = z.infer<typeof ClientZodSchema>;
export type ClientResponse = z.infer<typeof ClientResponseZodSchema>;
export type ClientListResponse = z.infer<typeof ClientListResponseZodSchema>;
export type RegisterClient = z.infer<typeof RegisterClientZodSchema>;
export type EditClient = z.infer<typeof EditClientZodSchema>;
export type GetClient = z.infer<typeof GetClientZodSchema>;

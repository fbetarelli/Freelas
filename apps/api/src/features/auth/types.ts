import z from "zod";

export const AccessTokenPayloadSchema = z.object({
  id: z.string(),
  role: z.string().optional(),
});

export type AccessTokenPayload = z.infer<typeof AccessTokenPayloadSchema>;
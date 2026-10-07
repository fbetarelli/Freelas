import * as z from "zod";
import { UserZodSchema } from "@freelancemanager/shared";

export type User = z.infer<typeof UserZodSchema>;

export type SessionUser = Omit<User, "hashPassword">;

export const AccessTokenPayloadSchema = z.object({
  id: z.string(),
  role: z.string().optional(),
});

export type AccessTokenPayload = z.infer<typeof AccessTokenPayloadSchema>;

import * as z from "zod";
import { UserZodSchema } from "@freelancemanager/shared";

export type User = z.infer<typeof UserZodSchema>;

export type SessionUser = Omit<User, "hashPassword">;

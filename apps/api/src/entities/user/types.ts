import * as z from "zod";
import { UserZodSchema, type UserResponse } from "@freelancemanager/shared";

export type User = z.infer<typeof UserZodSchema>;

export type SessionUser = UserResponse;

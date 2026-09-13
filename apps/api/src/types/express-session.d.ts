import "express-session";
import { SessionUser } from "../entities/user/types.ts";

declare module "express-session" {
  interface SessionData {
    user?: SessionUser | null;
    returnTo?: string;
  }
}

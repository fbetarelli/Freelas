import "express-session";
import { SessionUser } from "../resources/user/types.ts";

declare module "express-session" {
  interface SessionData {
    user?: SessionUser | null;
    returnTo?: string;
  }
}

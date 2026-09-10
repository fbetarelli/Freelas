import "express-session";
import { SessionUser } from "../resources/User/types.ts";

declare module "express-session" {
  interface SessionData {
    user?: SessionUser | null;
    returnTo?: string;
  }
}

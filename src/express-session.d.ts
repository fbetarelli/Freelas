import "express-session";

declare module "express-session" {
  interface SessionData {
    user?: {
      id: string;
      username: string;
      login: string;
    } | null;
    returnTo?: string;
  }
}

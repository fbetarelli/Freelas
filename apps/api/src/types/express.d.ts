import "express";
import type { AccessTokenPayload } from "../features/auth/types.ts";

declare global {
  namespace Express {
    interface Request {
      user?: AccessTokenPayload;
    }
  }
}

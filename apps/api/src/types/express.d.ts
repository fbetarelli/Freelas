import "express";
import type { AccessTokenPayload } from "../entities/user/types.ts";

declare global {
  namespace Express {
    interface Request {
      user?: AccessTokenPayload;
    }
  }
}

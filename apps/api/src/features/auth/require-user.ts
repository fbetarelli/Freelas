import type { Request } from "express";
import { UnauthorizedError } from "../../entities/errors/errors.ts";
import type { AccessTokenPayload } from "./types.ts";

export function requireUser(
  req: Pick<Request, "user">,
): AccessTokenPayload {
  if (!req.user) {
    throw new UnauthorizedError("Authentication required");
  }

  return req.user;
}

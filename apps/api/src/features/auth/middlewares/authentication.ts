import { type RequestHandler } from "express";
import { UnauthorizedError } from "../../../entities/errors/errors.ts";
import * as jwt from "jsonwebtoken";
import { z } from "zod";
import { getAuthConfig } from "../config.ts";
import { AccessTokenPayloadSchema } from "../types.ts";

const cookiesSchema = z.object({
  token: z.string().min(1),
});

export const authenticate: RequestHandler = (req, res, next) => {
  const cookies = cookiesSchema.safeParse(req.cookies);
  if (!cookies.success) {
    return next(new UnauthorizedError("Authentication required"));
  }

  let authConfig: ReturnType<typeof getAuthConfig>;
  try {
    authConfig = getAuthConfig();
  } catch (error) {
    return next(error);
  }

  try {
    const decoded = jwt.verify(
      cookies.data.token,
      authConfig.ACCESS_TOKEN_SECRET,
      {
        issuer: authConfig.JWT_ISSUER,
        audience: authConfig.JWT_AUDIENCE,
      },
    );
    const payload = AccessTokenPayloadSchema.safeParse(decoded);

    if (!payload.success) {
      return next(new UnauthorizedError("Invalid login token payload"));
    }

    req.user = payload.data;
    return next();
  } catch {
    return res
      .status(401)
      .json({ message: "Invalid or expired login session" });
  }
};

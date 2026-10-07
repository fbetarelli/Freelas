import { type RequestHandler } from "express";
import { BadRequestError, UnauthorizedError } from "../../../entities/errors/errors.ts";
import * as jwt from "jsonwebtoken";
import { z } from "zod";
import { AccessTokenPayloadSchema } from "../types.ts";

const cookiesSchema = z.object({
  token: z.string().min(1),
});

export const authenticate: RequestHandler = (req, res, next) => {
  const cookies = cookiesSchema.safeParse(req.cookies);
  if (!cookies.success) {
    return next(new UnauthorizedError("Authentication required"));
  }

  const secret = process.env.ACCESS_TOKEN_SECRET;
  if (!secret) {
    return next(new BadRequestError("ACCESS_TOKEN_SECRET is not configured"));
  }

  try {
    const decoded = jwt.verify(cookies.data.token, secret);
    const payload = AccessTokenPayloadSchema.safeParse(decoded);

    if (!payload.success) {
      return next(new BadRequestError("Invalid login token payload"));
    }

    req.user = payload.data;
    return next();
  } catch {
    return res
      .status(401)
      .json({ message: "Invalid or expired login session" });
  }
};

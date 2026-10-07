import type { CookieOptions, Response } from "express";
import type { AccessTokenPayload } from "./types.ts";
import * as jwt from "jsonwebtoken";

export const UserTokenConfiguration: CookieOptions = {
  httpOnly: true, // Blocks JavaScript access (XSS protection)
  secure: process.env.NODE_ENV === "production", // Transmit over HTTPS only in prod
  sameSite: "lax", // CSRF protection
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export const signToken = (payload: AccessTokenPayload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: "7d",
    issuer: process.env.JWT_ISSUER,
    audience: process.env.JWT_AUDIENCE,
  });
};

export const sendCookie = (res: Response, token: string) => {
  res.cookie("token", token, UserTokenConfiguration);
};

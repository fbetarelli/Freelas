import type { CookieOptions, Response } from "express";
import type { AccessTokenPayload } from "./types.ts";
import * as jwt from "jsonwebtoken";
import { getAuthConfig } from "./config.ts";

export const UserTokenConfiguration: CookieOptions = {
  httpOnly: true, // Blocks JavaScript access (XSS protection)
  secure: process.env.NODE_ENV === "production", // Transmit over HTTPS only in prod
  sameSite: "lax", // CSRF protection
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export const signToken = (payload: AccessTokenPayload) => {
  const { ACCESS_TOKEN_SECRET, JWT_ISSUER, JWT_AUDIENCE } = getAuthConfig();

  return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
    expiresIn: "7d",
    issuer: JWT_ISSUER,
    audience: JWT_AUDIENCE,
  });
};

export const sendCookie = (res: Response, token: string) => {
  res.cookie("token", token, UserTokenConfiguration);
};

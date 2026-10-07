import type {
  EditUser,
  LoginUser,
  RegisterUser,
} from "@freelancemanager/shared";
import { type CookieOptions, type RequestHandler } from "express";
import * as jwt from "jsonwebtoken";
import { type RequestWithBody } from "../../types/express-types.ts";
import { asyncHandler } from "../../utils/asyncHandler.ts";
import * as UserServices from "./services.ts";

export const logout: RequestHandler = (req, res) => {
  res.clearCookie("token");
  return res.sendStatus(200);
};

const tokenConfig: CookieOptions = {
  httpOnly: true, // Blocks JavaScript access (XSS protection)
  secure: process.env.NODE_ENV === "production", // Transmit over HTTPS only in prod
  sameSite: "lax", // CSRF protection
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export const login = asyncHandler(
  async (req: RequestWithBody<LoginUser>, res) => {
    const { login, password } = req.body;

    const result = await UserServices.login(login, password);
    //eslint-disable-next-line
    const { hashPassword, ...user } = result;

    const token = jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET!, {
      expiresIn: "7d",
    });

    // HttpOnly Cookie
    res.cookie("token", token, tokenConfig);

    res.status(200).json({ ...user });
    return;
  },
);

export const getMe = asyncHandler((req, res) => {
  return res.status(200).json(req.user ? { ...req.user } : null);
});

export const register = asyncHandler(
  async (req: RequestWithBody<RegisterUser>, res) => {
    const { username, login, password } = req.body;

    const result = await UserServices.register(username, login, password);

    const token = jwt.sign(
      { id: result.id },
      process.env.ACCESS_TOKEN_SECRET!,
      {
        expiresIn: "7d",
      },
    );

    // HttpOnly Cookie
    res.cookie("token", token, tokenConfig);

    return res.status(201).json({ ...result });
  },
);

export const editUser = asyncHandler(
  async (req: RequestWithBody<EditUser>, res) => {
    const result = await UserServices.editUser({
      ...req.body,
      id: req.user!.id,
    });

    return res.status(200).json({ ...result });
  },
);

import { type RequestHandler } from "express";
import { type RequestWithBody } from "../../types/express-types.ts";
import { asyncHandler } from "../../utils/asyncHandler.ts";
import * as UserServices from "./services.ts";
import type { EditUser, LoginUser, RegisterUser } from "@freelancemanager/shared";

export const logout: RequestHandler = (req, res) => {
  req.session.user = null;
  return res.sendStatus(200);
};

export const login = asyncHandler(
  async (req: RequestWithBody<LoginUser>, res) => {
    const { login, password } = req.body;

    const result = await UserServices.login(login, password);
    //eslint-disable-next-line
    const { hashPassword, ...user } = result;
    req.session.user = user;
    res.status(200).json({ ...user });
    return;
  },
);

export const register = asyncHandler(
  async (
    req: RequestWithBody<RegisterUser>,
    res,
  ) => {
    const { username, login, password } = req.body;

    const result = await UserServices.register(username, login, password);
    req.session.user = result;
    return res.status(201).json({ ...result });
  },
);

export const editUser = asyncHandler(
  async (
    req: RequestWithBody<EditUser>,
    res,
  ) => {

    const result = await UserServices.editUser({
      ...req.body,
      id: req.session.user!.id,
    });

    req.session.user = result;
    return res.status(200).json({ ...result });
  },
);

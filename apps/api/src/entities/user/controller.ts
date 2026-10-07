import type {
  EditUser,
  LoginUser,
  RegisterUser,
} from "@freelancemanager/shared";
import { type RequestHandler } from "express";
import { sendCookie, signToken } from "../../features/auth/helpers.ts";
import { type RequestWithBody } from "../../types/express-types.ts";
import { asyncHandler } from "../../utils/asyncHandler.ts";
import * as UserServices from "./services.ts";



export const login = asyncHandler(
  async (req: RequestWithBody<LoginUser>, res) => {
    const { login, password } = req.body;

    const result = await UserServices.login(login, password);
    //eslint-disable-next-line
    const { hashPassword, ...user } = result;

    const token = signToken({ id: user.id });
    sendCookie(res, token);
    
    res.status(200).json({ ...user });
    return;
  },
);

export const register = asyncHandler(
  async (req: RequestWithBody<RegisterUser>, res) => {
    const { username, login, password } = req.body;

    const result = await UserServices.register(username, login, password);

    const token = signToken({ id: result.id });
     sendCookie(res, token);
 

    return res.status(201).json({ ...result });
  },
);

export const logout: RequestHandler = (req, res) => {
  res.clearCookie("token");
  return res.sendStatus(200);
};

export const getMe = asyncHandler((req, res) => {
  return res.status(200).json(req.user);
});


export const editUser = asyncHandler(
  async (req: RequestWithBody<EditUser>, res) => {
    const result = await UserServices.editUser({
      ...req.body,
      id: req.user!.id,
    });

    return res.status(200).json({ ...result });
  },
);

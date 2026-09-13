import { type RequestHandler } from "express";
import { type RequestWithBody } from "../../types/express-types.ts";
import { asyncHandler } from "../../utils/asyncHandler.ts";
import { ApiError } from "../errors/errors.ts";
import * as UserServices from "./services.ts";

export const showLogin: RequestHandler = (req, res) => {
  return res.render("login", { message: req.flash("info") });
};

export const showRegister: RequestHandler = (req, res) => {
  return res.render("register");
};

export const showProfile: RequestHandler = (req, res) => {
  return res.render("profile", { user: req.session.user });
};

export const logout: RequestHandler = (req, res) => {
  req.session.user = null;
  return res.redirect("/login");
};

export const login = asyncHandler(
  async (req: RequestWithBody<{ email: string; password: string }>, res) => {
    const { email: login, password } = req.body;
    const result = await UserServices.login(login, password);

    if (result.user) {
      // eslint-disable-next-line
      const { hashPassword, ...user } = result.user;
      req.session.user = user;
      return res.redirect("/dashboard");
    } else {
      req.flash("info", "Login ou Senha inválidos.");
      return res.redirect("/login");
    }
  },
);

export const register = asyncHandler(
  async (
    req: RequestWithBody<{ username: string; email: string; password: string }>,
    res,
    next,
  ) => {
    const { username, email: login, password } = req.body;

    const result = await UserServices.register(username, login, password);
    if ("err" in result) {
      return next(result.err);
    }
    req.session.user = result.user;
    return res.redirect("/dashboard");
  },
);

export const editUser = asyncHandler(
  async (
    req: RequestWithBody<{
      username?: string;
      email?: string;
      password?: string;
    }>,
    res,
    next,
  ) => {
    const { email: login, ...rest } = req.body;
    const result = await UserServices.editUser({
      ...rest,
      id: req.session.user!.id,
      login,
    });

    if (result === null) {
      const err = new ApiError(500, "Profile Edit Failed");
      return next(err);
    }
    req.session.user = result;
    return res.redirect("/dashboard");
  },
);

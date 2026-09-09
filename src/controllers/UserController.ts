import { type RequestHandler } from "express";
import * as UserServices from  "../services/UserServices.ts";
import { asyncHandler } from  "../utils/asyncHandler.ts";

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

export const login = asyncHandler(async (req, res) => {
  let login = req.body.email;
  let password = req.body.password;

  let result = await UserServices.login(login, password);

  if (result.user) {
    req.session.user = {
      id: result.user.getId(),
      username: result.user.getUsername(),
      login: result.user.getLogin(),
    };
    return res.redirect("/dashboard");
  } else {
    req.flash("info", "Login ou Senha inválidos.");
    return res.redirect("/login");
  }
});

export const register = asyncHandler(async (req, res, next) => {
  let username = req.body.username;
  let login = req.body.email;
  let password = req.body.password;

  let result = await UserServices.register(username, login, password);

  if (result.err) {
    return next(result.err);
  }

  req.session.user = {
    id: result.user.getId(),
    username: result.user.getUsername(),
    login: result.user.getLogin(),
  };

  return res.redirect("/dashboard");
});

export const editUser = asyncHandler(async (req, res) => {
  let username = req.body.username;
  let login = req.body.email;
  let password = req.body.password;

  const result = await UserServices.editUser(
    req.session.user!.id,
    username,
    login,
    password,
  );

  req.session.user = {
    id: req.session.user!.id,
    username: result?.getUsername() ?? username,
    login: result?.getLogin() ?? login,
  };
  return res.redirect("/dashboard");
});

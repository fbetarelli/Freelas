import { type RequestHandler } from "express";

export const authenticate: RequestHandler = (req, res, next) => {
  if (req.session.user !== null && req.session.user !== undefined) {
    next();
  } else {
    res.redirect("/login");
  }
};

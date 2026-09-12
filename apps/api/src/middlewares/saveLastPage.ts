import { type RequestHandler } from "express";

export const saveLastPage: RequestHandler = (req, res, next) => {
  req.session.returnTo = req.originalUrl;
  next();
};

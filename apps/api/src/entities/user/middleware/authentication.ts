import { type RequestHandler } from "express";
import { UnauthorizedError } from "../../errors/errors.ts";

export const authenticate: RequestHandler = (req, res, next) => {
  if (req.session.user !== null && req.session.user !== undefined) {
    next();
  } else {
     const err = new UnauthorizedError('User not authenticated'); 
    return next(err);
  }
};

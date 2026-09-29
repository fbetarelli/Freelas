import type { RequestHandler } from "express";
import type { ZodType } from "zod";
import { BadRequestError } from "../entities/errors/errors.ts";

export const validate = (
  target: "body" | "params" | "query",
  schema: ZodType<unknown>,
): RequestHandler => {
  return (req, res, next) => {
    const result = schema.safeParse(req[target]);
    if (!result.success) return next(new BadRequestError(result.error.issues[0].message));
    req[target] = result.data;
    next();
  };
};

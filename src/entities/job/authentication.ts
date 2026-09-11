import { type RequestHandler } from "express";
import { JobDAO } from "./dao.ts";
import { assertIsString } from "../../utils/assert-is-string.ts";
import { CustomError } from "../Error/error.ts";

export const authorize: RequestHandler = async (req, res, next) => {
  const dao = new JobDAO();
  assertIsString(req.params.id, "Job Id");
  const job = await dao.getJobById(req.params.id);
  if (job && req.session.user && req.session.user.id === job.userId) {
    next();
  } else {
    const err = new CustomError(403, "Acesso Proibido");
    return next(err);
  }
};

import { type RequestHandler } from "express";
import { JobDAO } from "../dao.ts";
import { assertIsString } from "../../../utils/assert-is-string.ts";
import { requireUser } from "../../../features/auth/require-user.ts";

export const authorize: RequestHandler = async (req, res, next) => {
  const dao = new JobDAO();
  assertIsString(req.params.id, "Job Id");
  const job = await dao.getJobById(req.params.id, requireUser(req).id);
  if (job && requireUser(req).id === job.userid) {
    return next();
  }
  return next();
};

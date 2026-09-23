import { type RequestHandler } from "express";
import { JobDAO } from "../dao.ts";
import { assertIsString } from "../../../utils/assert-is-string.ts";
import { ForbiddenError } from "../../errors/errors.ts";

export const authorize: RequestHandler = async (req, res, next) => {
  const dao = new JobDAO();
  assertIsString(req.params.id, "Job Id");
  const job = await dao.getJobById(req.params.id);
  if (job && req.session.user && req.session.user.id === job.userid) {
    next();
  } else {
    const err = new ForbiddenError(
      "Access denied: You do not have permission to access this job.",
    );
    return next(err);
  }
};

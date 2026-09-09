import { type RequestHandler } from "express";
import { JobDAO } from  "../repositories/JobDAO.ts";
import { assertIsString } from  "../utils/assert-is-string.ts";

export const authorize: RequestHandler = async (req, res, next) => {
  let dao = new JobDAO();
  assertIsString(req.params.id, "Job Id");
  let job = await dao.getJobById(req.params.id);
  if (job && req.session.user && req.session.user.id === job.getUserId()) {
    next();
  } else {
    const err = Object.assign(new Error(), {
      customMessage: "Acesso Proibido",
      code: 401,
    });
    return next(err);
  }
};

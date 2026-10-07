import { type RequestHandler } from "express";
import { ClientDAO } from "../dao.ts";
import { assertIsString } from "../../../utils/assert-is-string.ts";
import { ForbiddenError } from "../../errors/errors.ts";

export const authorize: RequestHandler = async (req, res, next) => {
  const dao = new ClientDAO();
  assertIsString(req.params.id, "Client Id");

  const client = await dao.getClientById(req.params.id);

  if (client && req.user && req.user.id === client.userId) {
    return next();
  } else {
    const err = new ForbiddenError(
      "User not authorized to access this resource",
    );
    return next(err);
  }
};

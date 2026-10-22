import { type RequestHandler } from "express";
import { ClientDAO } from "../dao.ts";
import { assertIsString } from "../../../utils/assert-is-string.ts";
import { requireUser } from "../../../features/auth/require-user.ts";

export const authorize: RequestHandler = async (req, res, next) => {
  const dao = new ClientDAO();
  assertIsString(req.params.id, "Client Id");

  const client = await dao.getClientById(req.params.id, requireUser(req).id);

  if (client && requireUser(req).id === client.userId) {
    return next();
  }
  return next();
};

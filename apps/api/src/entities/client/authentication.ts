import { type RequestHandler } from "express";
import { ClientDAO } from "./dao.ts";
import { assertIsString } from "../../utils/assert-is-string.ts";

export const authorize: RequestHandler = async (req, res, next) => {
  const dao = new ClientDAO();
  assertIsString(req.params.id, "Client Id");

  const client = await dao.getClientById(req.params.id);

  if (client && req.session.user && req.session.user.id === client.userId) {
    return next();
  } else {
    const err = Object.assign(new Error(), {
      customMessage: "Acesso Proibido",
      code: 401,
    });
    return next(err);
  }
};

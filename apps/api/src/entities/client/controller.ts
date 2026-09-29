import type { EditClient, RegisterClient } from "@freelancemanager/shared";
import type { Request } from "express";
import { type RequestWithBody } from "../../types/express-types.ts";
import { asyncHandler } from "../../utils/asyncHandler.ts";
import { NotFoundError } from "../errors/errors.ts";
import * as ClientServices from "./services.ts";
import { type Client } from "./types.ts";

export const addClient = asyncHandler(
  async (req: RequestWithBody<RegisterClient>, res) => {
    const incomingClient = req.body;

    const client: Omit<Client, "id"> = {
      ...incomingClient,
      userId: req.session.user!.id,
    };
    const clientRes = await ClientServices.addClient(client);
    return res.status(201).json(clientRes);
  },
);

export const editClient = asyncHandler(
  async (req: Request<{ id: string }, unknown, EditClient>, res) => {
    const clientId = req.params.id;

    const client = {
      ...req.body,
      id: clientId,
      userId: req.session.user!.id,
    };

    await ClientServices.editClient(client);
    res.status(200).json(client);
  },
);

export const deleteClient = asyncHandler(
  async (req: Request<{ id: string }>, res) => {
    const clientId = req.params.id;

    await ClientServices.deleteClient(clientId);
    res.sendStatus(204);
  },
);

export const getClientById = asyncHandler(
  async (req: Request<{ id: string }>, res) => {
    const clientId = req.params.id;

    const client = await ClientServices.getClientById(clientId);

    if (client === null) {
      throw new NotFoundError("Client not found");
    }

    res.status(200).json(client);
  },
);

export const showClientList = asyncHandler(async (req, res) => {
  const incoming = req.query;

  const params = {
    page: Number(incoming.page) > 0 ? Number(incoming.page) : 1,
    userId: req.session.user!.id,
    search: typeof incoming.search === "string" ? incoming.search : "",
  };

  const totalPages = await ClientServices.getClientPages(params);
  const clients = await ClientServices.getClientListByPage(params);

  res.status(200).json({
    totalPages,
    clients,
  });
});

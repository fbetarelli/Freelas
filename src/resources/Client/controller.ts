import type { Request } from "express";
import { type RequestWithBody } from "../../types/express-types.ts";
import { assertIsString } from "../../utils/assert-is-string.ts";
import { asyncHandler } from "../../utils/asyncHandler.ts";
import { CustomError } from "../Error/error.ts";
import * as JobServices from "../Job/services.ts";
import * as ClientServices from "./services.ts";
import { type Client } from "./types.ts";

export const addClient = asyncHandler(
  async (req: RequestWithBody<Omit<Client, "id" | "userId">>, res) => {
    const incomingClient = req.body;

    const client: Omit<Client, "id"> = {
      ...incomingClient,
      userId: req.session.user!.id,
    };
    await ClientServices.addClient(client);
    res.redirect("dashboard");
  },
);

export const editClient = asyncHandler(
  async (req: Request<{ id: string }, unknown, Partial<Client>>, res) => {
    const clientId = req.params.id;
    assertIsString(clientId, "clientId");

    const { address, contact, name } = req.body;

    const client = {
      id: clientId,
      ...(name && { name }),
      ...(address && { address }),
      ...(contact && { contact }),
      userId: req.session.user!.id,
    };

    await ClientServices.editClient(client);
    res.redirect(`/client/${clientId}`);
  },
);

export const deleteClient = asyncHandler(
  async (req: Request<{ id: string }>, res) => {
    const clientId = req.params.id;
    assertIsString(clientId, "clientId");

    await ClientServices.deleteClient(clientId);
    res.redirect("/dashboard");
  },
);

export const getClientPage = asyncHandler(async (req, res, next) => {
  const clientId = req.params.id;
  assertIsString(clientId, "clientId");

  const client = await ClientServices.getClientById(clientId);
  const jobs = await JobServices.getJobsByClient(clientId);

  if (client === null) {
    const error = new CustomError(404, "Client not found");
    return next(error);
  }

  res.render("clientPage", {
    client,
    jobs,
  });
});
export const showClientList = asyncHandler(async (req, res) => {
  const incoming = req.query;

  if (req.session.user?.id === undefined) {
    return res.redirect("/login");
  }

  const params = {
    page: Number(incoming.page) > 0 ? Number(incoming.page) : 1,
    userId: req.session.user?.id,
    search: typeof incoming.search === "string" ? incoming.search : "",
  };

  const searchQuery = params.search
    ? `&search=${encodeURIComponent(params.search)}`
    : "";
  if (isNaN(params.page) || params.page < 1) {
    return res.redirect(`/clients?page=1${searchQuery}`);
  }

  const totalPages = await ClientServices.getClientPages(params);
  if (params.page > totalPages) {
    return res.redirect(`/clients?page=1${searchQuery}`);
  }

  const clientsResult = await ClientServices.getClientListByPage(params);

  return res.render("clientsList", {
    clients: clientsResult,
    totalPages,
    search: params.search,
    searchQuery,
    page: params.page,
  });
});

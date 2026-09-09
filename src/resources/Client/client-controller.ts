import { asyncHandler } from "../../utils/asyncHandler.ts";
import { Client } from "./types.ts";
import * as ClientServices from "./client-services.ts";
import * as JobServices from "../Job/job-services.ts";

export const addClient = asyncHandler(async (req, res) => {
  const client = new Client({
    id: "",
    name: req.body.name,
    address: req.body.address,
    contact: req.body.contact,
    userId: req.session.user!.id,
  });
  await ClientServices.addClient(client);

  res.redirect("dashboard");
});

export const editClient = asyncHandler(async (req, res) => {
  const clientId = req.params.id;
  if (typeof clientId !== "string") {
    return res.status(400).send("Invalid client id");
  }

  const client = new Client({
    id: clientId,
    name: req.body.name,
    address: req.body.address,
    contact: req.body.contact,
    userId: req.session.user!.id,
  });

  await ClientServices.editClient(client);
  res.redirect(`/client/${clientId}`);
});

export const deleteClient = asyncHandler(async (req, res) => {
  const clientId = req.params.id;
  if (typeof clientId !== "string") {
    return res.status(400).send("Invalid client id");
  }

  await ClientServices.deleteClient(clientId);
  res.redirect("/dashboard");
});

export const getClientPage = asyncHandler(async (req, res) => {
  const clientId = req.params.id;
  if (typeof clientId !== "string") {
    return res.status(400).send("Invalid client id");
  }
  const clientResult = await ClientServices.getClientById(clientId);
  const jobsResult = await JobServices.getJobsByClient(clientId);

  res.render("clientPage", {
    //@ts-ignore
    client: clientResult.client,
    //@ts-ignore

    jobs: jobsResult.jobsArray,
  });
});
export const showClientList = asyncHandler(async (req, res) => {
  const page = Number(req.query.page);
  const search = typeof req.query.search === "string" ? req.query.search : "";

  const params = {
    page,
    userId: req.session.user!.id,
    search,
  };

  const totalPages = await ClientServices.getClientPages(params);
  const searchQuery = search ? `&search=${encodeURIComponent(search)}` : "";
  if (isNaN(page) || page < 1 || page > totalPages) {
    return res.redirect(`/clients?page=1${searchQuery}`);
  }

  const clientsResult = await ClientServices.getClientListByPage(params);

  return res.render("clientsList", {
    //@ts-ignore
    clients: clientsResult.clients,
    totalPages,
    search,
    searchQuery,
    page: page,
  });
});

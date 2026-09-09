import { runDAO } from "../../utils/serviceHelper.ts";
import { ClientDAO } from "./client-DAO.ts";
import { toDTO } from "./client-mapper.ts";
import { Client } from "./types.ts";

const dao = new ClientDAO();

export const addClient = (client: Client) => {
  return runDAO(dao, "addClient", client);
};
export const editClient = async (client: Client) => {
  return runDAO(dao, "editClient", client);
};
export const deleteClient = async (clientId: string) => {
  return runDAO(dao, "deleteClient", clientId);
};

export const getLatestClients = async (userId: string) => {
  return runDAO(dao, "getLatestClients", userId, toDTO, "clients");
};

export const getClientById = async (id: string) => {
  return runDAO(dao, "getClientById", id, toDTO, "client");
};

export const getClientListByPage = async (params: {
  userId: string;
  search: string;
  page: number;
}) => {
  params.page -= 1;
  params.page *= 10;
  return runDAO(dao, "getClientListByPage", params, toDTO, "clients");
};

export const getClientPages = async (params: {
  userId: string;
  search: string;
}) => {
  let total = await dao.getClientCount(params);

  return Math.max(1, Math.ceil(total / 10));
};

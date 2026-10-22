import { type SearchObject } from "../../types/search-types.ts";
import { removeUndefined } from "../../utils/remove-undefined.ts";
import { NotFoundError } from "../errors/errors.ts";
import { ClientDAO } from "./dao.ts";
import { type Client } from "./types.ts";

const dao = new ClientDAO();

export const addClient = async (client: Omit<Client, "id">) => {
  return await dao.addClient(client);
};

export const editClient = async (
  incomingClient: Partial<Client> & { id: string },
  userId: string,
) => {
  const { id, name, address, contact } = incomingClient;
  const clientWithoutId = removeUndefined({
    name: name?.trim() !== "" ? name : undefined,
    address,
    contact: contact?.trim() !== "" ? contact : undefined,
  });

  const updatedClient = await dao.editClient(
    { ...clientWithoutId, id },
    userId,
  );
  if (!updatedClient) throw new NotFoundError("Client not found");
  return updatedClient;
};
export const deleteClient = async (clientId: string, userId: string) => {
  const deleted = await dao.deleteClient(clientId, userId);
  if (!deleted) throw new NotFoundError("Client not found");
};

export const getLatestClients = async (userId: string) => {
  const latestClients = await dao.getLatestClients(userId);
  return latestClients;
};

export const getClientById = async (id: string, userId: string) => {
  return await dao.getClientById(id, userId);
};

export const getClientListByPage = async (query: SearchObject) => {
  const params = {
    ...query,
    page: (query.page - 1) * 10,
  };
  return await dao.getClientListByPage(params);
};

export const getClientPages = async (params: Omit<SearchObject, "page">) => {
  const total = await dao.getClientCount(params);
  return Math.max(1, Math.ceil(total / 10));
};

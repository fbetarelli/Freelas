import { type SearchObject } from "../../types/search-types.ts";
import { ClientDAO } from "./dao.ts";
import { type Client } from "./types.ts";

const dao = new ClientDAO();

export const addClient = async (client: Omit<Client, "id">) => {
  return await dao.addClient(client);
};

export const editClient = async (
  incomingClient: Partial<Client> & { id: string },
): Promise<void> => {
  const { id, name, address, contact, userId } = incomingClient;
  const client = {
    id,
    userId,
    ...(name?.trim() !== "" && { name }),
    ...(address !== undefined && { address }),
    ...(contact?.trim() !== "" && { contact }),
  };
  return await dao.editClient(client);
};
export const deleteClient = async (clientId: string) => {
  return await dao.deleteClient(clientId);
};

export const getLatestClients = async (userId: string) => {
  const latestClients = await dao.getLatestClients(userId);
  return latestClients;
};

export const getClientById = async (id: string) => {
  return await dao.getClientById(id);
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

import { pool } from "../../database/database.ts";
import { type SearchObject } from "../../types/search-types.ts";
import { dynamicFieldsBuilder } from "../../utils/dynamic-fields-builder.ts";
import { errorLog } from "../../utils/error-log.ts";
import { validateSearch } from "../../utils/validate-search.ts";
import { type Client } from "./types.ts";

interface ClientQueryResult extends Omit<Client, "userId"> {
  userid: string;
}

export class ClientDAO {
  async addClient(client: Omit<Client, "id">) {
    const query = daoQueries.addClient;
    const params = [client.name, client.address, client.contact, client.userId];

    try {
      await pool.query(query, params);
    } catch (error) {
      errorLog("ClientDAO", "addClient");
      throw error;
    }
  }
  async deleteClient(clientId: string) {
    const query = daoQueries.deleteClient;
    const params = [clientId];

    try {
      await pool.query(query, params);
    } catch (error) {
      errorLog("ClientDAO", "deleteClient");
      throw error;
    }
  }
  async editClient(client: Partial<Client> & { id: string }) {
    const { fields, values, index } = dynamicFieldsBuilder(client);
    values.push(client.id);
    const query = daoQueries.editClient(fields, index);

    try {
      await pool.query(query, values);
    } catch (error) {
      errorLog("ClientDAO", "editClient");
      throw error;
    }
  }
  async getLatestClients(userId: string): Promise<Client[] | []> {
    const query = daoQueries.getLatestClients;
    const params = [userId];

    try {
      const res = await pool.query<ClientQueryResult>(query, params);
      const clientsArray: Client[] = [];

      if (res.rows.length > 0) {
        res.rows.forEach((obj) => {
          const { userid: userId, ...rest } = obj;

          const client = {
            ...rest,
            userId,
          };
          clientsArray.push(client);
        });
      }
      return clientsArray;
    } catch (error) {
      errorLog("ClientDAO", "getLatestClients");
      throw error;
    }
  }
  async getClientListByPage({
    search,
    userId,
    page,
  }: SearchObject): Promise<Client[] | []> {
    const searchValue = validateSearch(search);
    const query = daoQueries.getClientListByPage;
    const params = [userId, searchValue, page];

    try {
      const res = await pool.query<ClientQueryResult>(query, params);
      const clientsArray: Client[] = [];

      if (res.rows.length > 0) {
        res.rows.forEach((obj) => {
          const { userid: userId, ...rest } = obj;
          const client = {
            ...rest,
            userId,
          };
          clientsArray.push(client);
        });
      }
      return clientsArray;
    } catch (error) {
      errorLog("ClientDAO", "getClientListByPage");
      throw error;
    }
  }
  async getClientCount({
    userId,
    search,
  }: Omit<SearchObject, "page">): Promise<number> {
    const searchValue = validateSearch(search);
    const query = daoQueries.getClientCount;
    const params = [userId, searchValue];

    try {
      const res = await pool.query<{
        count_cols: string;
      }>(query, params);
      return Number(res.rows[0].count_cols);
    } catch (error) {
      errorLog("ClientDAO", "getClientCount");
      throw error;
    }
  }
  async getClientById(clientId: string): Promise<Client | null> {
    const query = daoQueries.getClientById;
    const params = [clientId];

    try {
      const res = await pool.query<ClientQueryResult>(query, params);

      if (res.rows.length > 0) {
        const { userid: userId, ...rest } = res.rows[0];
        const client = {
          ...rest,
          userId,
        };

        return client;
      }
      return null;
    } catch (error) {
      errorLog("ClientDAO", "getClientById");
      throw error;
    }
  }
}

const daoQueries = {
  addClient: `INSERT INTO clients(name,address,contact,userID) VALUES ($1,$2,$3,$4) RETURNING 1`,
  deleteClient: `DELETE FROM clients WHERE id=$1`,
  editClient: (fields: string[], index: number) =>
    `UPDATE clients SET ${fields.join(", ")} WHERE id=$${index}`,
  getLatestClients: `
                        SELECT * FROM clients LEFT JOIN (SELECT clientId, MAX(jobDate) AS lastJobDate
                        FROM jobs
                        GROUP BY clientId) AS latest_jobs ON clients.id = latest_jobs.clientid WHERE clients.userId = $1 ORDER BY  latest_jobs.lastJobDate DESC NULLS FIRST LIMIT 5
                        `,
  getClientListByPage: `
                        SELECT * FROM clients LEFT JOIN (SELECT clientId, MAX(jobDate) AS lastJobDate
                        FROM jobs
                        GROUP BY clientId) AS latest_jobs ON clients.id = latest_jobs.clientid WHERE clients.userId = $1 AND (unaccent(name) ILIKE unaccent($2) OR $2 IS NULL) ORDER BY  latest_jobs.lastJobDate DESC NULLS FIRST LIMIT 10 OFFSET $3
                        `,
  getClientCount: `
                       SELECT COUNT(*) AS count_cols FROM clients WHERE userId = $1 AND (unaccent(name) ILIKE unaccent($2) OR $2 IS NULL)    
             `,
  getClientById: `SELECT * FROM clients WHERE id=$1`,
};

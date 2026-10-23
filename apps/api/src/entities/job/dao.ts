import { pool } from "../../database/database.ts";
import { type SearchObject } from "../../types/search-types.ts";
import { dynamicFieldsBuilder } from "../../utils/dynamic-fields-builder.ts";
import { errorLog } from "../../utils/error-log.ts";
import { validateSearch } from "../../utils/validate-search.ts";
import { type Job, type JobQueryResult } from "./types.ts";

export class JobDAO {
  async addJob(job: Omit<Job, "id">) {
    const { clientId, userId, descr, jobDate, totalValue, payed } = job;

    const query = daoQueries.addJob;
    const params = [descr, jobDate, totalValue, clientId, userId, payed];

    try {
      const res = await pool.query<JobQueryResult>(query, params);
      return res.rows.length > 0 ? res.rows[0] : null;
    } catch (error) {
      errorLog("JobDAO", "addJob");
      throw error;
    }
  }
  async editJob(job: Partial<Job> & { id: string }, userId: string) {
    try {
      const { id, ...editableJob } = job;
      const { fields, index, values } = dynamicFieldsBuilder(editableJob);
      values.push(id, userId);

      const query = daoQueries.editJob(fields, index);

      const res = await pool.query<JobQueryResult>(query, values);
      return res.rows.length > 0 ? res.rows[0] : null;
    } catch (error) {
      errorLog("JobDAO", "editJob");
      throw error;
    }
  }
  async deleteJob(jobid: string, userId: string) {
    const query = daoQueries.deleteJob;
    const params = [jobid, userId];

    try {
      const result = await pool.query(query, params);
      return result.rowCount === 1;
    } catch (error) {
      errorLog("JobDAO", "deleteJob");
      throw error;
    }
  }
  async getJobById(id: string, userId: string): Promise<JobQueryResult | null> {
    const query = daoQueries.getJobById;
    const params = [id, userId];

    try {
      const res = await pool.query<JobQueryResult>(query, params);

      return res.rows.length > 0 ? res.rows[0] : null;
    } catch (error) {
      errorLog("JobDAO", "getJobById");
      throw error;
    }
  }
  async getJobsByClient(clientId: string, userId: string) {
    const query = daoQueries.getJobsByClient;
    const params = [clientId, userId];

    try {
      const client = await pool.query(daoQueries.clientExists, params);
      if (client.rows.length === 0) return null;
      const res = await pool.query<JobQueryResult>(query, params);
      return res.rows;
    } catch (error) {
      errorLog("JobDAO", "getJobsByClient");
      throw error;
    }
  }
  async getLastJobsByUser(userId: string) {
    const query = `SELECT * FROM jobs WHERE userId=$1 ORDER BY jobDate DESC LIMIT 5 `;
    const params = [userId];

    try {
      const res = await pool.query<JobQueryResult>(query, params);
      return res.rows.length > 0 ? res.rows : [];
    } catch (error) {
      errorLog("JobDAO", "getLastJobsByUser");
      throw error;
    }
  }
  async getJobCount(userId: string) {
    const query = `SELECT COUNT(*) FROM jobs AS count
                        WHERE userId = $1 AND jobDate >= CURRENT_DATE - INTERVAL '1 month'`;
    const params = [userId];

    try {
      const res = await pool.query<{ count: string }>(query, params);

      return Number(res.rows[0].count);
    } catch (error) {
      errorLog("JobDAO", "getJobCount");
      throw error;
    }
  }

  async getJobListByPage({ search, userId, page }: SearchObject) {
    const searchValue = validateSearch(search);
    const params = [userId, searchValue, page];
    const query = daoQueries.getJobListByPage;

    try {
      const res = await pool.query<JobQueryResult>(query, params);
      return res.rows.length > 0 ? res.rows : [];
    } catch (error) {
      errorLog("JobDAO", "getJobListByPage");
      throw error;
    }
  }
  async getJobListCount(obj: { userId: string; search: string | null }) {
    const searchValue = validateSearch(obj.search);
    const query = daoQueries.getJobListCount;
    const params = [obj.userId, searchValue];

    try {
      const res = await pool.query<{ count_cols: string }>(query, params);

      return Number(res.rows[0].count_cols);
    } catch (error) {
      errorLog("JobDAO", "getJobListCount");
      throw error;
    }
  }
}

const daoQueries = {
  addJob: `INSERT INTO jobs(descr,jobDate,totalValue,clientId,userId,payed)
    SELECT $1,$2,$3,$4,$5,$6 FROM clients
    WHERE clients.id=$4 AND clients.userId=$5 RETURNING *`,
  editJob: (fields: string[], index: number) =>
    `UPDATE jobs SET ${fields.join(", ")} WHERE id=$${index} AND userId=$${index + 1} RETURNING *`,
  deleteJob: `DELETE FROM jobs WHERE id=$1 AND userId=$2`,
  getJobById: `SELECT * FROM jobs WHERE id=$1 AND userId=$2`,
  clientExists: `SELECT 1 FROM clients WHERE id=$1 AND userId=$2`,
  getJobsByClient: `SELECT * FROM jobs WHERE clientId=$1 AND userId=$2 ORDER BY jobDate DESC`,
  getLastJobsByUser: `SELECT * FROM jobs WHERE userId=$1 ORDER BY jobDate DESC LIMIT 5`,
  getJobCount: `SELECT COUNT(*) FROM jobs AS count
                        WHERE userId = $1 AND jobDate >= CURRENT_DATE - INTERVAL '1 month'`,
  getJobListCount: `SELECT COUNT(*) AS count_cols FROM jobs AS count
                        WHERE userId = $1 AND (unaccent(descr) ILIKE unaccent($2) ESCAPE E'\\\\' OR $2 IS NULL)`,
  getJobListByPage: `
                        SELECT * FROM jobs  WHERE userId = $1 AND (unaccent(descr) ILIKE unaccent($2) ESCAPE E'\\\\' OR $2 IS NULL) ORDER BY  jobDate DESC NULLS FIRST LIMIT 10 OFFSET $3
                        `,
};

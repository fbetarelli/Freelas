import { pool } from "../../database/database.ts";
import { type SearchObject } from "../../types/search-types.ts";
import { dynamicFieldsBuilder } from "../../utils/dynamic-fields-builder.ts";
import { errorLog } from "../../utils/error-log.ts";
import { formatDate } from "../../utils/formatting-helpers.ts";
import { validateSearch } from "../../utils/validate-search.ts";
import { type Job } from "./types.ts";

interface JobQueryResult extends Omit<
  Job,
  "jobDate" | "clientId" | "userId" | "totalValue"
> {
  totalvalue: string;
  jobdate: string;
  clientid: string;
  userid: string;
}

type FormattedJob = Omit<Job, "payed"> & {
  payed: string;
};

export class JobDAO {
  async addJob(job: Omit<Job, "id">) {
    const { clientId, userId, descr, jobDate, totalValue } = job;

    const query = daoQueries.addJob;
    const params = [descr, jobDate, totalValue, clientId, userId];

    try {
      await pool.query(query, params);
    } catch (error) {
      errorLog("JobDAO", "addJob");
      throw error;
    }
  }
  async editJob(job: Partial<Job> & { id: string }) {
    try {
      const { fields, index, values } = dynamicFieldsBuilder(job);
      values.push(job.id);

      const query = daoQueries.editJob(fields, index);

      await pool.query(query, values);
    } catch (error) {
      errorLog("JobDAO", "editJob");
      throw error;
    }
  }
  async deleteJob(jobid: string) {
    const query = daoQueries.deleteJob;
    const params = [jobid];

    try {
      await pool.query(query, params);
    } catch (error) {
      errorLog("JobDAO", "deleteJob");
      throw error;
    }
  }
  async getJobById(id: string): Promise<FormattedJob | null> {
    const query = daoQueries.getJobById;
    const params = [id];

    try {
      const res = await pool.query<JobQueryResult>(query, params);
      if (res.rows.length > 0) {
        const {
          jobdate: jobDate,
          clientid: clientId,
          userid: userId,
          totalvalue: totalValue,
          payed: isPayed,
          ...rest
        } = res.rows[0];
        const job: FormattedJob = {
          ...rest,
          clientId,
          userId,
          payed: isPayed ? "Pagamento Realizado" : "Aguardando pagamento",
          jobDate: formatDate(jobDate),
          totalValue: Number(totalValue),
        };
        return job;
      }
      return null;
    } catch (error) {
      errorLog("JobDAO", "getJobById");
      throw error;
    }
  }
  async getJobsByClient(clientId: string) {
    const query = `SELECT * FROM jobs WHERE clientId=$1 ORDER BY jobDate DESC`;
    const params = [clientId];

    try {
      const res = await pool.query<JobQueryResult>(query, params);
      const jobsArray: FormattedJob[] = [];

      if (res.rows.length > 0) {
        res.rows.forEach((obj) => {
          const {
            jobdate: jobDate,
            clientid: clientId,
            userid: userId,
            totalvalue: totalValue,
            payed: isPayed,
            ...rest
          } = obj;
          const job = {
            ...rest,
            clientId,
            userId,
            payed: isPayed ? "Pagamento Realizado" : "Aguardando pagamento",
            jobDate: formatDate(jobDate),
            totalValue: Number(totalValue),
          };
          jobsArray.push(job);
        });
      }
      return jobsArray;
    } catch (error) {
      errorLog("JobDAO", "getJobsByClient");
      throw error;
    }
  }
  async getLastJobsByUser(userId: string): Promise<FormattedJob[]> {
    const query = `SELECT * FROM jobs WHERE userId=$1 ORDER BY jobDate DESC LIMIT 5 `;
    const params = [userId];

    try {
      const res = await pool.query<JobQueryResult>(query, params);
      const jobsArray: FormattedJob[] = [];

      if (res.rows.length > 0) {
        res.rows.forEach((obj) => {
          const {
            jobdate: jobDate,
            clientid: clientId,
            userid: userId,
            totalvalue: totalValue,
            payed: isPayed,
            ...rest
          } = obj;
          const job = {
            ...rest,
            clientId,
            userId,
            payed: isPayed ? "Pagamento Realizado" : "Aguardando pagamento",
            jobDate: formatDate(jobDate),
            totalValue: Number(totalValue),
          };
          jobsArray.push(job);
        });
      }
      return jobsArray;
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
      const jobsArray: FormattedJob[] = [];
      if (res.rows.length > 0) {
        res.rows.forEach((obj) => {
          const {
            jobdate: jobDate,
            clientid: clientId,
            userid: userId,
            totalvalue: totalValue,
            payed: isPayed,
            ...rest
          } = obj;
          const job = {
            ...rest,
            clientId,
            userId,
            payed: isPayed ? "Pagamento Realizado" : "Aguardando pagamento",
            jobDate: formatDate(jobDate),
            totalValue: Number(totalValue),
          };
          jobsArray.push(job);
        });
      }
      return jobsArray;
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
  addJob: `INSERT INTO jobs(descr,jobDate,totalValue,clientId,userId) VALUES ($1,$2,$3,$4,$5)`,
  editJob: (fields: string[], index: number) =>
    `UPDATE jobs SET ${fields.join(", ")} WHERE id=$${index}`,
  deleteJob: `DELETE FROM jobs WHERE id=$1`,
  getJobById: `SELECT * FROM jobs WHERE id=$1`,
  getJobsByClient: `SELECT * FROM jobs WHERE clientId=$1 ORDER BY jobDate DESC`,
  getLastJobsByUser: `SELECT * FROM jobs WHERE userId=$1 ORDER BY jobDate DESC LIMIT 5`,
  getJobCount: `SELECT COUNT(*) FROM jobs AS count
                        WHERE userId = $1 AND jobDate >= CURRENT_DATE - INTERVAL '1 month'`,
  getJobListCount: `SELECT COUNT(*) AS count_cols FROM jobs AS count
                        WHERE userId = $1 AND (unaccent(descr) ILIKE unaccent($2) OR $2 IS NULL)`,
  getJobListByPage: `
                        SELECT * FROM jobs  WHERE userId = $1 AND (unaccent(descr) ILIKE unaccent($2) OR $2 IS NULL) ORDER BY  jobDate DESC NULLS FIRST LIMIT 10 OFFSET $3
                        `,
};

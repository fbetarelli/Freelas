import { pool } from  "../models/Database.ts";
import { Job, type JobType } from  "../models/Job.ts";

export class JobDAO {
  async addJob(job: Job) {
    const query = `INSERT INTO jobs(descr,jobDate,totalValue,clientId,userId) VALUES ($1,$2,$3,$4,$5)`;
    const params = [
      job.getDescription(),
      job.getJobDate(),
      job.getTotalValue(),
      job.getClientId(),
      job.getUserId(),
    ];

    try {
      await pool.query(query, params);
    } catch (error) {
      console.error("Erro no JobDAO addJobs " + error);
      throw error;
    }
  }
  async editJob(job: Job) {
    try {
      let fields: string[] = [];
      let values: string[] = [];
      let index = 1;

      Object.entries(job).forEach(([key, value]) => {
        if (value) {
          fields.push(`${key} = $${index++}`);
          values.push(value);
        }
      });
      values.push(job.id);

      const query = `UPDATE jobs SET ${fields.join(", ")} WHERE id=$${index}`;

      await pool.query(query, values);
    } catch (error) {
      console.error("Erro no JobDAO editJob " + error);
      throw error;
    }
  }
  async deleteJob(jobid: string) {
    const query = `DELETE FROM jobs WHERE id=$1`;
    const params = [jobid];

    try {
      await pool.query(query, params);
    } catch (error) {
      console.error("Erro no JobDAO deleteJob " + error);
      throw error;
    }
  }
  async getJobById(id: string) {
    const query = `SELECT * FROM jobs WHERE id=$1`;
    const params = [id];

    try {
      const res = await pool.query<{
        id: string;
        jobdate: string;
        descr: string;
        payed: boolean;
        totalvalue: number;
        userid: string;
        clientid: string;
      }>(query, params);
      if (res.rows.length > 0) {
        let job = new Job({
          clientId: res.rows[0].clientid,
          userId: res.rows[0].userid,
          id: res.rows[0].id,
          payed: res.rows[0].payed,
          jobDate: res.rows[0].jobdate,
          descr: res.rows[0].descr,
          totalValue: res.rows[0].totalvalue,
        });
        return job;
      }
      return null;
    } catch (error) {
      console.error("Erro no JobDAO getJobById " + error);
      throw error;
    }
  }
  async getJobsByClient(clientId: string) {
    const query = `SELECT * FROM jobs WHERE clientId=$1 ORDER BY jobDate DESC`;
    const params = [clientId];

    try {
      const res = await pool.query<{
        id: string;
        jobdate: string;
        descr: string;
        payed: boolean;
        totalvalue: number;
        userid: string;
        clientid: string;
      }>(query, params);
      const jobsArray: Job[] = [];
      if (res.rows.length > 0) {
        res.rows.forEach((obj) => {
          let job = new Job({
            id: obj.id,
            jobDate: obj.jobdate,
            descr: obj.descr,
            payed: obj.payed,
            totalValue: obj.totalvalue,
            clientId: obj.clientid,
            userId: obj.userid,
          });
          jobsArray.push(job);
        });
      }
      return jobsArray;
    } catch (error) {
      console.error("Erro no JobDAO getJobsByClient " + error);
      throw error;
    }
  }
  async getLastJobsByUser(userId: string) {
    const query = `SELECT * FROM jobs WHERE userId=$1 ORDER BY jobDate DESC LIMIT 5 `;
    const params = [userId];

    try {
      const res = await pool.query(query, params);
      const jobsArray: Job[] = [];
      if (res.rows.length > 0) {
        res.rows.forEach((obj) => {
          let job = new Job({
            id: obj.id,
            jobDate: obj.jobdate,
            descr: obj.descr,
            payed: obj.payed,
            totalValue: obj.totalvalue,
            clientId: obj.clientid,
            userId: obj.userid,
          });
          jobsArray.push(job);
        });
      }
      return jobsArray;
    } catch (error) {
      console.error("Erro no JobDAO getLastJobsByUser " + error);
      throw error;
    }
  }
  async getJobCount(userId: string) {
    const query = `SELECT COUNT(*) FROM jobs AS count
                        WHERE userId = $1 AND jobDate >= CURRENT_DATE - INTERVAL '1 month'`;
    const params = [userId];

    try {
      const res = await pool.query<{ count: string }>(query, params);

      return res.rows[0].count;
    } catch (error) {
      console.error("Erro no JobDAO getJobCount " + error);
      throw error;
    }
  }

  async getJobListByPage(obj: {
    userId: string;
    search: string;
    page: number;
  }) {
    const searchValue = obj.search ? `%${obj.search}%` : null;
    const query = `
                        SELECT * FROM jobs  WHERE userId = $1 AND (unaccent(descr) ILIKE unaccent($2) OR $2 IS NULL) ORDER BY  jobDate DESC NULLS FIRST LIMIT 10 OFFSET $3
                        `;
    const params = [obj.userId, searchValue, obj.page];

    try {
      const res = await pool.query(query, params);
      const jobsArray: Job[] = [];
      if (res.rows.length > 0) {
        res.rows.forEach((obj) => {
          let job = new Job({
            id: obj.id,
            jobDate: obj.jobdate,
            descr: obj.descr,
            payed: obj.payed,
            totalValue: obj.totalvalue,
            clientId: obj.clientid,
            userId: obj.userid,
          });
          jobsArray.push(job);
        });
      }
      return jobsArray;
    } catch (error) {
      console.error("Erro no ClienteDAO getJobListByPage " + error);
      throw error;
    }
  }
  async getJobListCount(obj: { userId: string; search: string | null }) {
    const searchValue = obj.search ? `%${obj.search}%` : null;
    const query = `
                       SELECT COUNT(*) AS count_cols FROM jobs WHERE userId = $1 AND (unaccent(descr) ILIKE unaccent($2) OR $2 IS NULL)    
             `;
    const params = [obj.userId, searchValue];

    try {
      const res = await pool.query<{ count_cols: string }>(query, params);

      return Number(res.rows[0].count_cols);
    } catch (error) {
      console.error("Erro no ClienteDAO getJobListCount " + error);
      throw error;
    }
  }
}

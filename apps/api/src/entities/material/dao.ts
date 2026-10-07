import { pool } from "../../database/database.ts";
import { dynamicFieldsBuilder } from "../../utils/dynamic-fields-builder.ts";
import { errorLog } from "../../utils/error-log.ts";
import { type Material } from "./types.ts";

export interface MaterialQueryResult extends Omit<Material, "unitaryVal" | "jobId"> {
  unitaryval: string;
  jobid: string;
}

export class MaterialDAO {
  async addMaterial(material: Omit<Material, "id">) {
    const { descr, supplier, qnt, unitaryVal, jobId } = material;
    try {
      const query = daoQueries.addMaterial;
      const params = [descr, supplier, qnt, unitaryVal, jobId];

      const res = await pool.query<MaterialQueryResult>(query, params);
      return res.rows.length > 0 ? res.rows[0] : null;
    } catch (error) {
      errorLog("Material DAO", "addMaterial");
      throw error;
    }
  }
  async editMaterial(material: Partial<Material> & { id: string }) {
    try {
      const { fields, index, values } = dynamicFieldsBuilder(material);
      values.push(material.id);

      const query = daoQueries.editMaterial(fields, index);

      const res = await pool.query<MaterialQueryResult>(query, values);
      return res.rows.length > 0 ? res.rows[0] : null;
    } catch (error) {
      errorLog("Material DAO", "editMaterial");
      throw error;
    }
  }
  async deleteMaterial(materialid: string) {
    const query = daoQueries.deleteMaterial;
    const params = [materialid];

    try {
      await pool.query(query, params);
    } catch (error) {
      errorLog("Material DAO", "deleteMaterial");
      throw error;
    }
  }

  async getMaterialsByJob(jobId: string) {
    const query = daoQueries.getMaterialsByJob;
    const params = [jobId];

    try {
      const res = await pool.query<MaterialQueryResult>(query, params);
           return res.rows.length > 0 ? res.rows : [];

    } catch (error) {
      errorLog("Material DAO", "getMaterialsByJob");
      throw error;
    }
  }
  async getTotalFromLastMonth(userId: string) {
    const query = daoQueries.getTotalFromLastMonth;
    const params = [userId];

    try {
      const res = await pool.query<{ sum: string }>(query, params);
      if (res.rows.length > 0) {
        return Number(res.rows[0].sum);
      }
      return 0;
    } catch (error) {
      errorLog("Material DAO", "getTotalFromLastMonth");
      throw error;
    }
  }
}

const daoQueries = {
  addMaterial: `INSERT INTO materials(descr,supplier,qnt, unitaryVal,jobId) VALUES ($1,$2,$3,$4,$5) RETURNING *`,
  editMaterial: (fields: string[], index: number) =>
    `UPDATE materials SET ${fields.join(", ")} WHERE id = $${index} RETURNING *`,
  deleteMaterial: `DELETE FROM materials WHERE id = $1`,
  getMaterialsByJob: `SELECT * FROM materials WHERE jobId = $1`,
  getTotalFromLastMonth: `SELECT SUM(materials.unitaryVal*qnt) FROM materials JOIN jobs ON materials.jobId = jobs.id WHERE jobs.userId = $1 AND jobs.jobDate >= CURRENT_DATE - INTERVAL '1 month'`,
};

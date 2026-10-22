import { pool } from "../../database/database.ts";
import { dynamicFieldsBuilder } from "../../utils/dynamic-fields-builder.ts";
import { errorLog } from "../../utils/error-log.ts";
import { type Material } from "./types.ts";

export interface MaterialQueryResult extends Omit<
  Material,
  "unitaryVal" | "jobId"
> {
  unitaryval: string;
  jobid: string;
}

export class MaterialDAO {
  async addMaterial(material: Omit<Material, "id">, userId: string) {
    const { descr, supplier, qnt, unitaryVal, jobId } = material;
    try {
      const query = daoQueries.addMaterial;
      const params = [descr, supplier, qnt, unitaryVal, jobId, userId];

      const res = await pool.query<MaterialQueryResult>(query, params);
      return res.rows.length > 0 ? res.rows[0] : null;
    } catch (error) {
      errorLog("Material DAO", "addMaterial");
      throw error;
    }
  }
  async editMaterial(
    material: Partial<Material> & { id: string },
    userId: string,
  ) {
    try {
      const { id, ...editableMaterial } = material;
      const { fields, index, values } = dynamicFieldsBuilder(editableMaterial);
      values.push(id, userId);

      const query = daoQueries.editMaterial(fields, index);

      const res = await pool.query<MaterialQueryResult>(query, values);
      return res.rows.length > 0 ? res.rows[0] : null;
    } catch (error) {
      errorLog("Material DAO", "editMaterial");
      throw error;
    }
  }
  async deleteMaterial(materialid: string, userId: string) {
    const query = daoQueries.deleteMaterial;
    const params = [materialid, userId];

    try {
      const result = await pool.query(query, params);
      return result.rowCount === 1;
    } catch (error) {
      errorLog("Material DAO", "deleteMaterial");
      throw error;
    }
  }

  async getMaterialsByJob(jobId: string, userId: string) {
    const query = daoQueries.getMaterialsByJob;
    const params = [jobId, userId];

    try {
      const job = await pool.query(daoQueries.jobExists, params);
      if (job.rows.length === 0) return null;
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
  addMaterial: `INSERT INTO materials(descr,supplier,qnt, unitaryVal,jobId)
    SELECT $1,$2,$3,$4,$5 FROM jobs
    WHERE jobs.id=$5 AND jobs.userId=$6 RETURNING *`,
  editMaterial: (fields: string[], index: number) =>
    `UPDATE materials SET ${fields.join(", ")} WHERE id = $${index} AND EXISTS (
      SELECT 1 FROM jobs WHERE jobs.id = materials.jobId AND jobs.userId = $${index + 1}
    ) RETURNING *`,
  deleteMaterial: `DELETE FROM materials WHERE id = $1 AND EXISTS (
    SELECT 1 FROM jobs WHERE jobs.id = materials.jobId AND jobs.userId = $2
  )`,
  jobExists: `SELECT 1 FROM jobs WHERE id = $1 AND userId = $2`,
  getMaterialsByJob: `SELECT materials.* FROM materials JOIN jobs ON materials.jobId = jobs.id WHERE materials.jobId = $1 AND jobs.userId = $2`,
  getTotalFromLastMonth: `SELECT SUM(materials.unitaryVal*qnt) FROM materials JOIN jobs ON materials.jobId = jobs.id WHERE jobs.userId = $1 AND jobs.jobDate >= CURRENT_DATE - INTERVAL '1 month'`,
};

import { pool } from "../../database/database.ts";
import { dynamicFieldsBuilder } from "../../utils/dynamic-fields-builder.ts";
import { errorLog } from "../../utils/error-log.ts";
import { type Payment } from "./types.ts";

export type PaymentQueryResult = Omit<Payment, "paymentDate" | "jobId"> & {
  paymentdate: string;
  jobid: string;
  aggregatetotal: string;
};

export class PaymentDAO {
  async addPayment(payment: Omit<Payment, "id">, userId: string) {
    const { method, paymentDate, value, installment, jobId } = payment;
    try {
      const query = daoQueries.addPayment;
      const params = [method, paymentDate, value, installment, jobId, userId];

      const res = await pool.query<PaymentQueryResult>(query, params);
      return res.rows.length > 0 ? res.rows[0] : null;
    } catch (error) {
      errorLog("PaymentDAO", "addPayment");
      throw error;
    }
  }
  async editPayment(payment: Partial<Payment> & { id: string }, userId: string) {
    try {
      const { id, ...editablePayment } = payment;
      const { fields, index, values } = dynamicFieldsBuilder(editablePayment);
      values.push(id, userId);

      const query = daoQueries.editPayment(fields, index);
      const res = await pool.query<PaymentQueryResult>(query, values);
      return res.rows.length > 0 ? res.rows[0] : null;
    } catch (error) {
      errorLog("PaymentDAO", "editPayment");
      throw error;
    }
  }
  async deletePayment(paymentid: string, userId: string) {
    const query = daoQueries.deletePayment;
    const params = [paymentid, userId];

    try {
      const result = await pool.query(query, params);
      return result.rowCount === 1;
    } catch (error) {
      errorLog("PaymentDAO", "deletePayment");
      throw error;
    }
  }

  async getPaymentsByJob(jobId: string, userId: string) {
    const query = daoQueries.getPaymentsByJob;
    const params = [jobId, userId];

    try {
      const job = await pool.query(daoQueries.jobExists, params);
      if (job.rows.length === 0) return null;
      const res = await pool.query<PaymentQueryResult>(query, params);
      return res.rows.length > 0 ? res.rows : [];
    } catch (error) {
      errorLog("PaymentDAO", "getPaymentsByJob");
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
      errorLog("PaymentDAO", "getTotalFromLastMonth");
      throw error;
    }
  }
}

const daoQueries = {
  addPayment: `INSERT INTO payments(method,paymentDate,value,installment,jobId)
    SELECT $1,$2,$3,$4,$5 FROM jobs
    WHERE jobs.id=$5 AND jobs.userId=$6 RETURNING *`,
  editPayment: (fields: string[], index: number) =>
    `UPDATE payments SET ${fields.join(", ")} WHERE id=$${index} AND EXISTS (
      SELECT 1 FROM jobs WHERE jobs.id = payments.jobId AND jobs.userId = $${index + 1}
    ) RETURNING *`,
  deletePayment: `DELETE FROM payments WHERE id=$1 AND EXISTS (
    SELECT 1 FROM jobs WHERE jobs.id = payments.jobId AND jobs.userId = $2
  )`,
  jobExists: `SELECT 1 FROM jobs WHERE id=$1 AND userId=$2`,
  getPaymentsByJob: `SELECT payments.*, SUM(payments.value) OVER () AS aggregatetotal
    FROM payments JOIN jobs ON payments.jobId = jobs.id
    WHERE payments.jobId=$1 AND jobs.userId=$2 ORDER BY paymentDate`,
  getTotalFromLastMonth: `SELECT SUM(payments.value) FROM payments
                        JOIN jobs ON payments.jobId = jobs.id
                        WHERE jobs.userId = $1 AND jobs.jobDate >= CURRENT_DATE - INTERVAL '1 month'`,
};

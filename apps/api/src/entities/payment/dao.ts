import { pool } from "../../database/database.ts";
import { dynamicFieldsBuilder } from "../../utils/dynamic-fields-builder.ts";
import { errorLog } from "../../utils/error-log.ts";
import { type Payment } from "./types.ts";

export type PaymentQueryResult = Omit<Payment, "paymentDate" | "jobId"> & {
  paymentdate: string;
  jobid: string;
};

export class PaymentDAO {
  async addPayment(payment: Omit<Payment, "id">) {
    const { method, paymentDate, value, installment, jobId } = payment;
    try {
      const query = daoQueries.addPayment;
      const params = [method, paymentDate, value, installment, jobId];

      const res = await pool.query<PaymentQueryResult>(query, params);
      return res.rows.length > 0 ? res.rows[0] : null;
    } catch (error) {
      errorLog("PaymentDAO", "addPayment");
      throw error;
    }
  }
  async editPayment(payment: Partial<Payment> & { id: string }) {
    try {
      const { fields, index, values } = dynamicFieldsBuilder(payment);
      values.push(payment.id);

      const query = daoQueries.editPayment(fields, index);
      const res = await pool.query<PaymentQueryResult>(query, values);
      return res.rows.length > 0 ? res.rows[0] : null;
    } catch (error) {
      errorLog("PaymentDAO", "editPayment");
      throw error;
    }
  }
  async deletePayment(paymentid: string) {
    const query = daoQueries.deletePayment;
    const params = [paymentid];

    try {
      await pool.query(query, params);
    } catch (error) {
      errorLog("PaymentDAO", "deletePayment");
      throw error;
    }
  }

  async getPaymentsByJob(jobId: string) {
    const query = daoQueries.getPaymentsByJob;
    const params = [jobId];

    try {
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
  addPayment: `INSERT INTO payments(method,paymentDate,value,installment,jobId) VALUES ($1,$2,$3,$4,$5) RETURNING *`,
  editPayment: (fields: string[], index: number) =>
    `UPDATE payments SET ${fields.join(", ")} WHERE id=$${index} RETURNING *`,
  deletePayment: `DELETE FROM payments WHERE id=$1`,
  getPaymentsByJob: `SELECT * FROM payments WHERE jobId=$1 ORDER BY paymentDate`,
  getTotalFromLastMonth: `SELECT SUM(payments.value) FROM payments
                        JOIN jobs ON payments.jobId = jobs.id
                        WHERE jobs.userId = $1 AND jobs.jobDate >= CURRENT_DATE - INTERVAL '1 month'`,
};

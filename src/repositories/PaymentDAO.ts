import { pool } from  "../models/Database.ts";
import { Payment, type PaymentType } from  "../models/Payment.ts";

export class PaymentDAO {
  async addPayment(payment: Payment) {
    try {
      const query = `INSERT INTO payments(method,paymentDate,value,installment,jobId) VALUES ($1,$2,$3,$4,$5)`;
      const params = [
        payment.getMethod(),
        payment.getPaymentDate(),
        payment.getValue(),
        payment.getInstallment(),
        payment.getJobId(),
      ];

      await pool.query(query, params);
    } catch (error) {
      console.error("Erro no PaymentDAO addPayments " + error);
      throw error;
    }
  }
  async editPayment(payment: Payment) {
    try {
      let fields: string[] = [];
      let values: string[] = [];
      let index = 1;

      Object.entries(payment).forEach(([key, value]) => {
        if (value) {
          fields.push(`${key} = $${index++}`);
          values.push(value);
        }
      });
      values.push(payment.id);

      const query = `UPDATE payments SET ${fields.join(", ")} WHERE id=$${index}`;
      await pool.query(query, values);
    } catch (error) {
      console.error("Erro no PaymentDAO editPayments " + error);
      throw error;
    }
  }
  async deletePayment(paymentid: string) {
    const query = `DELETE FROM payments WHERE id=$1`;
    const params = [paymentid];

    try {
      await pool.query(query, params);
    } catch (error) {
      console.error("Erro no PaymentDAO editPayments " + error);
      throw error;
    }
  }

  async getPaymentsByJob(jobId: string) {
    const query = `SELECT * FROM payments WHERE jobId=$1 ORDER BY paymentDate`;
    const params = [jobId];

    try {
      const res = await pool.query<{
        id: string;
        method: string;
        paymentdate: string;
        value: number;
        installment: number;
        jobid: string;
      }>(query, params);
      const paymentsArray: PaymentType[] = [];
      if (res.rows.length > 0) {
        res.rows.forEach((obj) => {
          const payment = new Payment({
            id: obj.id,
            method: obj.method,
            paymentDate: obj.paymentdate,
            value: obj.value,
            installment: obj.installment,
            jobId: obj.id,
          });
          paymentsArray.push(payment);
        });
      }
      return paymentsArray;
    } catch (error) {
      console.error("Erro no PaymentDAO getPaymentsByJob " + error);
      throw error;
    }
  }
  async getTotalFromLastMonth(userId: string) {
    const query = `SELECT SUM(payments.value) FROM payments
                        JOIN jobs ON payments.jobId = jobs.id
                        WHERE jobs.userId = $1 AND jobs.jobDate >= CURRENT_DATE - INTERVAL '1 month'`;
    const params = [userId];

    try {
      const res = await pool.query<{ sum: string }>(query, params);
      if (res.rows.length > 0) {
        return res.rows[0].sum;
      }
      return 0;
    } catch (error) {
      console.error("Erro no PaymentDAO getTotalFromLastMonth " + error);
      throw error;
    }
  }
}

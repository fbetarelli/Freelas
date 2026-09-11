import { PaymentDAO } from "./dao.ts";
import { type Payment } from "./types.ts";

const dao = new PaymentDAO();

export const addPayment = async (payment: Omit<Payment, "id">) => {
  return await dao.addPayment(payment);
};
export const editPayment = async (
  incomingPayment: Partial<Payment> & { id: string },
) => {
  const { id, installment, jobId, method, paymentDate, value } =
    incomingPayment;

  const payment = {
    id,
    jobId,
    ...(installment ? { installment } : {}),
    ...(method !== undefined ? { method } : {}),
    ...(paymentDate !== undefined && paymentDate.trim() !== ""
      ? { paymentDate }
      : {}),
    ...(value ? { value } : {}),
  };

  return await dao.editPayment(payment);
};
export const deletePayment = async (paymentId: string) => {
  return await dao.deletePayment(paymentId);
};

export const getPaymentsByJob = async (jobId: string) => {
  const paymentsArray = await dao.getPaymentsByJob(jobId);

  const totalValue = paymentsArray.reduce((acc, payment) => {
    return acc + payment.value;
  }, 0);

  return { data: paymentsArray, totalValue };
};

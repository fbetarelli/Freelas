import { removeUndefined } from "../../utils/remove-undefined.ts";
import { NotFoundError } from "../errors/errors.ts";
import { PaymentDAO } from "./dao.ts";
import { type Payment } from "./types.ts";
import { toFormattedPayment } from "./utils/mapper.ts";

const dao = new PaymentDAO();

export const addPayment = async (
  payment: Omit<Payment, "id">,
  userId: string,
) => {
  const dbPayment = await dao.addPayment(payment, userId);
  if (dbPayment === null) {
    throw new NotFoundError("Job not found");
  }
  return toFormattedPayment(dbPayment);
};
export const editPayment = async (
  incomingPayment: Partial<Payment> & { id: string },
  userId: string,
) => {
  const { id, installment, jobId, method, paymentDate, value } =
    incomingPayment;

  const paymentWithoutId = removeUndefined({
    jobId,
    installment: installment !== undefined ? installment : undefined,
    method: method !== undefined ? method : undefined,
    paymentDate:
      paymentDate !== undefined && paymentDate.trim() !== ""
        ? paymentDate
        : undefined,
    value: value !== undefined ? value : undefined,
  });

  const payment = {
    ...paymentWithoutId,
    id,
  };

  const dbPayment = await dao.editPayment(payment, userId);
  if (dbPayment === null) {
    throw new NotFoundError("Payment not found");
  }
  return toFormattedPayment(dbPayment);
};
export const deletePayment = async (paymentId: string, userId: string) => {
  const deleted = await dao.deletePayment(paymentId, userId);
  if (!deleted) throw new NotFoundError("Payment not found");
};

export const getPaymentsByJob = async (jobId: string, userId: string) => {
  const dbPayments = await dao.getPaymentsByJob(jobId, userId);
  if (dbPayments === null) throw new NotFoundError("Job not found");

  const totalValue = dbPayments.reduce((acc, payment) => {
    return acc + payment.value;
  }, 0);

  const payments = dbPayments.map(toFormattedPayment);

  return { data: payments, totalValue };
};

import { removeUndefined } from "../../utils/remove-undefined.ts";
import { ApiError } from "../errors/errors.ts";
import { PaymentDAO } from "./dao.ts";
import { type Payment } from "./types.ts";
import { toFormattedPayment } from "./utils/mapper.ts";

const dao = new PaymentDAO();

export const addPayment = async (payment: Omit<Payment, "id">) => {
  const dbPayment = await dao.addPayment(payment);
  if (dbPayment === null) {
    throw new ApiError(500, "Failed to add payment");
  }
  return toFormattedPayment(dbPayment);
};
export const editPayment = async (
  incomingPayment: Partial<Payment> & { id: string },
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

  const dbPayment = await dao.editPayment(payment);
  if (dbPayment === null) {
    throw new ApiError(500, "Failed to edit payment");
  }
  return toFormattedPayment(dbPayment);
};
export const deletePayment = async (paymentId: string) => {
  return await dao.deletePayment(paymentId);
};

export const getPaymentsByJob = async (jobId: string) => {
  const dbPayments = await dao.getPaymentsByJob(jobId);

  const totalValue = dbPayments.reduce((acc, payment) => {
    return acc + payment.value;
  }, 0);

  const payments = dbPayments.map(toFormattedPayment);

  return { data: payments, totalValue };
};

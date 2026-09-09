import { PaymentDAO } from "../repositories/PaymentDAO.ts";
import { runDAO } from "../utils/serviceHelper.ts";
import { toDTO } from "../mappers/PaymentMapper.ts";
import { Payment } from "../models/Payment.ts";

const dao = new PaymentDAO();

export const addPayment = async (payment: Payment) => {
  return runDAO(dao, "addPayment", payment);
};
export const editPayment = async (payment: Payment) => {
  return runDAO(dao, "editPayment", payment);
};
export const deletePayment = async (paymentId: string) => {
  return runDAO(dao, "deletePayment", paymentId);
};

export const getPaymentsByJob = async (jobId: string) => {
  return runDAO(
    dao,
    "getPaymentsByJob",
    jobId,
    toDTO,
    "payments",
    true,
    "value",
  );
};

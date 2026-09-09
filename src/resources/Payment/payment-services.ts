import { runDAO } from "../../utils/serviceHelper.ts";
import { PaymentDAO } from "./payment-DAO.ts";
import { toDTO } from "./payment-mapper.ts";
import { Payment } from "./types.ts";

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

import { type Request } from "express";
import { assertIsString } from "../../utils/assert-is-string.ts";
import { asyncHandler } from "../../utils/asyncHandler.ts";
import * as PaymentServices from "./services.ts";
import { type Payment } from "./types.ts";

export const addPayment = asyncHandler(
  async (req: Request<{ id: string }, unknown, Omit<Payment, "id">>, res) => {
    assertIsString(req.params.id, "Job Id");

    const incomingPayment = {
      method: req.body.method,
      installment: req.body.installment,
      paymentDate: req.body.paymentDate,
      value: req.body.value,
      jobId: req.params.id,
    };

    const payment = await PaymentServices.addPayment(incomingPayment);
    res.status(200).json(payment);
  },
);

export const getByJob = asyncHandler(
  async (req: Request<{ id: string }>, res) => {
    assertIsString(req.params.id, "Job Id");

    const payments = await PaymentServices.getPaymentsByJob(req.params.id);
    res.status(200).json(payments);
  },
);

export const editPayment = asyncHandler(
  async (req: Request<{ id: string }, unknown, Partial<Payment>>, res) => {
    assertIsString(req.params.id, "Payment Id");

    const incomingPayment = {
      id: req.params.id,
      method: req.body.method,
      installment: req.body.installment,
      paymentDate: req.body.paymentDate,
      value: req.body.value,
    };

    const payment = await PaymentServices.editPayment(incomingPayment);
    res.status(200).json(payment);
  },
);

export const deletePayment = asyncHandler(
  async (req: Request<{ id: string }>, res) => {
    assertIsString(req.params.id, "Payment Id");
    await PaymentServices.deletePayment(req.params.id);
    res.sendStatus(204);
  },
);

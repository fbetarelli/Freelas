import { type Request } from "express";
import { assertIsString } from "../../utils/assert-is-string.ts";
import { asyncHandler } from "../../utils/asyncHandler.ts";
import { formatValueToFloat } from "../../utils/formatting-helpers.ts";
import * as PaymentServices from "./services.ts";
import { type Payment } from "./types.ts";

export const addPayment = asyncHandler(
  async (req: Request<{ id: string }, unknown, Omit<Payment, "id">>, res) => {
    const valor = formatValueToFloat(req.body.value.toString());
    assertIsString(req.params.id, "Job Id");

    const payment = {
      ...req.body,
      value: valor,
      jobId: req.params.id,
    };

    await PaymentServices.addPayment(payment);
    res.redirect(`/job/${req.params.id}`);
  },
);

export const editPayment = asyncHandler(
  async (
    req: Request<{ id: string; paymentid: string }, unknown, Partial<Payment>>,
    res,
  ) => {
    const valor = formatValueToFloat(req.body.value?.toString() ?? "0");
    assertIsString(req.params.id, "Job Id");
    assertIsString(req.params.paymentid, "Payment Id");

    const payment = {
      ...req.body,
      id: req.params.paymentid,
      value: valor,
      jobId: req.params.id,
    };

    await PaymentServices.editPayment(payment);
    res.redirect(`/job/${req.params.id}`);
  },
);

export const deletePayment = asyncHandler(
  async (req: Request<{ id: string; paymentid: string }>, res) => {
    assertIsString(req.params.paymentid, "Payment Id");
    await PaymentServices.deletePayment(req.params.paymentid);
    res.redirect(`/job/${req.params.id}`);
  },
);

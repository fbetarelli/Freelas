import { assertIsString } from "../../utils/assert-is-string.ts";
import { asyncHandler } from "../../utils/asyncHandler.ts";
import { formatarParaFloat } from "../../utils/formattingHelpers.ts";
import * as PaymentServices from "./payment-services.ts";
import { Payment } from "./types.ts";

export const addPayment = asyncHandler(async (req, res) => {
  const valor = formatarParaFloat(req.body.value);
  assertIsString(req.params.id, "Job Id");
  const payment = new Payment({
    id: "",
    method: req.body.method,
    paymentDate: req.body.paymentDate,
    value: valor,
    installment: req.body.installment,
    jobId: req.params.id,
  });

  await PaymentServices.addPayment(payment);
  res.redirect(`/job/${req.params.id}`);
});

export const editPayment = asyncHandler(async (req, res) => {
  let valor;
  if (req.body.value) {
    valor = formatarParaFloat(req.body.value);
  }

  assertIsString(req.params.paymentid, "Payment Id");
  assertIsString(req.params.id, "Job Id");
  const payment = new Payment({
    id: req.params.paymentid,
    method: req.body.method,
    paymentDate: req.body.paymentDate,
    // @ts-ignore
    value: valor,
    installment: req.body.installment,
    jobId: req.params.id,
  });

  await PaymentServices.editPayment(payment);
  res.redirect(`/job/${req.params.id}`);
});

export const deletePayment = asyncHandler(async (req, res) => {
  assertIsString(req.params.paymentid, "Payment Id");
  await PaymentServices.deletePayment(req.params.paymentid);
  res.redirect(`/job/${req.params.id}`);
});

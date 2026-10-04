import express from "express";
import { authorize } from "../job/middleware/authentication.ts";
import * as PaymentController from "../payment/controller.ts";
import { authorizePaymentOwner } from "../../middlewares/authorizeOwnerViaJob.ts";
import {
  EditPaymentZodSchema,
  GetJobZodSchema,
  GetPaymentZodSchema,
  RegisterPaymentZodSchema,
} from "@freelancemanager/shared";
import { validate } from "../../middlewares/zodValidate.ts";
const router = express.Router();
export const paymentRoutes = (app: express.Application) => {
  app.use("/", router);

  router.get(
    "/jobs/:id/payments",
    validate("params", GetJobZodSchema),

    authorize,
    PaymentController.getByJob,
  );
  router.post(
    "/jobs/:id/payments",
    validate("params", GetJobZodSchema),
    validate("body", RegisterPaymentZodSchema),
    authorize,
    PaymentController.addPayment,
  );
  router.patch(
    "/payment/:id",
    validate("params", GetPaymentZodSchema),
    validate("body", EditPaymentZodSchema),
    authorizePaymentOwner,
    PaymentController.editPayment,
  );
  router.delete(
    "/payment/:id",
    validate("params", GetPaymentZodSchema),
    authorizePaymentOwner,
    PaymentController.deletePayment,
  );
};

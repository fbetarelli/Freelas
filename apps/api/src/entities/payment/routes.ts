import express from "express";
import { authenticate } from "../../features/auth/middlewares/authentication.ts";
import * as PaymentController from "../payment/controller.ts";
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
    authenticate,
    PaymentController.getByJob,
  );
  router.post(
    "/jobs/:id/payments",
    validate("params", GetJobZodSchema),
    validate("body", RegisterPaymentZodSchema),
    authenticate,
    PaymentController.addPayment,
  );
  router.patch(
    "/payment/:id",
    validate("params", GetPaymentZodSchema),
    validate("body", EditPaymentZodSchema),
    authenticate,
    PaymentController.editPayment,
  );
  router.delete(
    "/payment/:id",
    validate("params", GetPaymentZodSchema),
    authenticate,
    PaymentController.deletePayment,
  );
};

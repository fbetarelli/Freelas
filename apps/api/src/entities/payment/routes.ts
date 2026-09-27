import express from "express";
import { authorize } from "../job/middleware/authentication.ts";
import * as PaymentController from "../payment/controller.ts";
import { authorizePaymentOwner } from "../../middlewares/authorizeOwnerViaJob.ts";
const router = express.Router();
export const paymentRoutes = (app: express.Application) => {
  app.use("/", router);

  router.get("/jobs/:id/payments", authorize, PaymentController.getByJob);
  router.post("/jobs/:id/payments", authorize, PaymentController.addPayment);
  router.patch(
    "/payment/:id",
    authorizePaymentOwner,
    PaymentController.editPayment,
  );
  router.delete(
    "/payment/:id",
    authorizePaymentOwner,
    PaymentController.deletePayment,
  );
};

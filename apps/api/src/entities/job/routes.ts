import express from "express";
const router = express.Router();
import * as JobController from "./controller.ts";
import * as MaterialController from "../material/controller.ts";
import * as PaymentController from "../payment/controller.ts";
import { authorize } from "./middleware/authentication.ts";
import { authenticate } from "../user/middleware/authentication.ts";
import { authorize as clientAuthorize } from "../client/middleware/authentication.ts";
export const jobRoutes = (app: express.Application) => {
  app.use("/", router);

  router.get("/client/:id/jobs", clientAuthorize, JobController.getByClient);

  router.get("/job/:id", authorize, JobController.getById);
  router.patch("/job/:id/edit", authorize, JobController.editJob);
  router.delete("/job/:id", authorize, JobController.deleteJob);

  router.post(
    "/job/:id/material/add",
    authorize,
    MaterialController.addMaterial,
  );
  router.post(
    "/job/:id/material/:materialid/edit",
    authorize,
    MaterialController.editMaterial,
  );
  router.get(
    "/job/:id/material/:materialid/delete",
    authorize,
    MaterialController.deleteMaterial,
  );

  router.post("/job/:id/payment/add", authorize, PaymentController.addPayment);
  router.post(
    "/job/:id/payment/:paymentid/edit",
    authorize,
    PaymentController.editPayment,
  );
  router.get(
    "/job/:id/payment/:paymentid/delete",
    authorize,
    PaymentController.deletePayment,
  );

  router.get("/jobs", authenticate, JobController.showJobList);
};

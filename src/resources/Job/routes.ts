import express from "express";
const router = express.Router();
import * as JobController from "./controller.ts";
import * as MaterialController from "../Material/controller.ts";
import * as PaymentController from "../Payment/controller.ts";
import { authorize } from "./authentication.ts";
import { authenticate } from "../User/authentication.ts";

export const jobRoutes = (app: express.Application) => {
  app.use("/", router);

  router.get("/job/:id", authorize, JobController.getJobPage);
  router.post("/job/:id/edit", authorize, JobController.editJob);
  router.get("/job/:id/delete", authorize, JobController.deleteJob);

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

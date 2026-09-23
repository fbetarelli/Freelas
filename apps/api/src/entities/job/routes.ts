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

  router.get("/clients/:id/jobs", clientAuthorize, JobController.getByClient);
  router.post("/clients/:id/jobs", clientAuthorize, JobController.addJob);
  
  router.get("/jobs", authenticate, JobController.showJobList);
  router.get("/jobs/:id", authorize, JobController.getById);
  router.patch("/jobs/:id", authorize, JobController.editJob);
  router.delete("/jobs/:id", authorize, JobController.deleteJob);
  
  router.post("/jobs/:id/material", authorize, MaterialController.addMaterial);
  router.patch(
    "/materials/:materialid",
    authorize,
    MaterialController.editMaterial,
  );
  router.delete(
    "/materials/:materialid",
    authorize,
    MaterialController.deleteMaterial,
  );

  router.post("/jobs/:id/payment", authorize, PaymentController.addPayment);
  router.patch(
    "/jobs/:id/payment/:paymentid",
    authorize,
    PaymentController.editPayment,
  );
  router.delete(
    "/jobs/:id/payment/:paymentid",
    authorize,
    PaymentController.deletePayment,
  );

};

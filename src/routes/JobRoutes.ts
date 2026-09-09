import express from "express";
const router = express.Router();
import * as JobController from  "../controllers/JobController.ts";
import * as MaterialController from  "../controllers/MaterialController.ts";
import * as PaymentController from  "../controllers/PaymentController.ts";
import { authorize } from  "../middlewares/jobAuth.ts";
import { authenticate } from  "../middlewares/userAuth.ts";

router.get("/job/:id", authorize, JobController.getJobPage);
router.post("/job/:id/edit", authorize, JobController.editJob);
router.get("/job/:id/delete", authorize, JobController.deleteJob);

router.post("/job/:id/material/add", authorize, MaterialController.addMaterial);
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

export default router;

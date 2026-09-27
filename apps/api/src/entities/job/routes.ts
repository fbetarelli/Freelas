import express from "express";
import { authorize as clientAuthorize } from "../client/middleware/authentication.ts";
import { authenticate } from "../user/middleware/authentication.ts";
import * as JobController from "./controller.ts";
import { authorize } from "./middleware/authentication.ts";
const router = express.Router();
export const jobRoutes = (app: express.Application) => {
  app.use("/", router);

  router.get("/clients/:id/jobs", clientAuthorize, JobController.getByClient);
  router.post("/clients/:id/jobs", clientAuthorize, JobController.addJob);
  
  router.get("/jobs", authenticate, JobController.showJobList);
  router.get("/jobs/:id", authorize, JobController.getById);
  router.patch("/jobs/:id", authorize, JobController.editJob);
  router.delete("/jobs/:id", authorize, JobController.deleteJob);

};

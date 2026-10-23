import express from "express";
import { authenticate } from "../../features/auth/middlewares/authentication.ts";
import * as JobController from "./controller.ts";
import { validate } from "../../middlewares/zodValidate.ts";
import {
  EditJobZodSchema,
  GetClientZodSchema,
  GetJobZodSchema,
  PaginatedSearchZodSchema,
  RegisterJobZodSchema,
} from "@freelancemanager/shared";
const router = express.Router();
export const jobRoutes = (app: express.Application) => {
  app.use("/", router);

  router.get(
    "/clients/:id/jobs",
    validate("params", GetClientZodSchema),
    authenticate,
    JobController.getByClient,
  );
  router.post(
    "/clients/:id/jobs",
    validate("params", GetClientZodSchema),
    validate("body", RegisterJobZodSchema),
    authenticate,
    JobController.addJob,
  );

  router.get(
    "/jobs",
    authenticate,
    validate("query", PaginatedSearchZodSchema),
    JobController.showJobList,
  );
  router.get(
    "/jobs/:id",
    validate("params", GetJobZodSchema),
    authenticate,
    JobController.getById,
  );
  router.patch(
    "/jobs/:id",
    validate("params", GetJobZodSchema),
    validate("body", EditJobZodSchema),
    authenticate,
    JobController.editJob,
  );
  router.delete(
    "/jobs/:id",
    validate("params", GetJobZodSchema),
    authenticate,
    JobController.deleteJob,
  );
};

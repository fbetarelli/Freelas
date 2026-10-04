import express from "express";
import { authorize as clientAuthorize } from "../client/middleware/authentication.ts";
import { authenticate } from "../user/middleware/authentication.ts";
import * as JobController from "./controller.ts";
import { authorize } from "./middleware/authentication.ts";
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
    clientAuthorize,
    JobController.getByClient,
  );
  router.post(
    "/clients/:id/jobs",
    validate("params", GetClientZodSchema),
    validate("body", RegisterJobZodSchema),
    clientAuthorize,
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
    authorize,
    JobController.getById,
  );
  router.patch(
    "/jobs/:id",
    validate("params", GetJobZodSchema),
    validate("body", EditJobZodSchema),
    authorize,
    JobController.editJob,
  );
  router.delete(
    "/jobs/:id",
    validate("params", GetJobZodSchema),
    authorize,
    JobController.deleteJob,
  );
};

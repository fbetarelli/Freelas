import type { Application } from "express";
import { clientRoutes } from "../entities/client/routes.ts";
import { userRoutes } from "../entities/user/routes.ts";
import { jobRoutes } from "../entities/job/routes.ts";
import { dashboardRoutes } from "../features/dashboard/routes.ts";
import { errorHandler } from "../entities/errors/errors.ts";
import { materialRoutes } from "../entities/material/routes.ts";
import { paymentRoutes } from "../entities/payment/routes.ts";

export const routes = (app: Application) => {
  userRoutes(app);
  clientRoutes(app);
  jobRoutes(app);
  materialRoutes(app);
  paymentRoutes(app);
  dashboardRoutes(app);
  errorHandler(app);
};

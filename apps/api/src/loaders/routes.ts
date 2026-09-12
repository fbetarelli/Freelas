import type { Application } from "express";
import { clientRoutes } from "../entities/Client/routes.ts";
import { userRoutes } from "../entities/User/routes.ts";
import { jobRoutes } from "../entities/Job/routes.ts";
import { dashboardRoutes } from "../features/dashboard/routes.ts";
import { errorHandler } from "../entities/Error/error.ts";

export const routes = (app: Application) => {
  userRoutes(app);
  clientRoutes(app);
  jobRoutes(app);
  dashboardRoutes(app);
  errorHandler(app);
};

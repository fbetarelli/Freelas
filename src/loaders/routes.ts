import type { Application } from "express";
import { clientRoutes } from "../resources/Client/routes.ts";
import { userRoutes } from "../resources/User/routes.ts";
import { jobRoutes } from "../resources/Job/routes.ts";
import { dashboardRoutes } from "../features/Dashboard/routes.ts";
import { errorHandler } from "../resources/Error/error.ts";

export const routes = (app: Application) => {
  userRoutes(app);
  clientRoutes(app);
  jobRoutes(app);
  dashboardRoutes(app);
  errorHandler(app);
};

import express from "express";
import { authenticate } from "../../entities/user/middleware/authentication.ts";
import * as DashboardController from "./controller.ts";
const router = express.Router();

export const dashboardRoutes = (app: express.Application) => {
  app.use("/", router);

  router.get(
    "/dashboard",
    authenticate,
    DashboardController.showDashboard,
  );
};

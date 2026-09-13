import express from "express";
const router = express.Router();
import * as DashboardController from "./controller.ts";
import * as ClientController from "../../entities/client/controller.ts";
import { authenticate } from "../../entities/user/middleware/authentication.ts";
import { saveLastPage } from "../../middlewares/saveLastPage.ts";

export const dashboardRoutes = (app: express.Application) => {
  app.use("/", router);

  router.get(
    "/dashboard",
    saveLastPage,
    authenticate,
    DashboardController.showDashboard,
  );

  router.post("/addClient", authenticate, ClientController.addClient);
};

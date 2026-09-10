import express from "express";
const router = express.Router();
import * as DashboardController from "./controller.ts";
import * as ClientController from "../../resources/Client/controller.ts";
import { authenticate } from "../../resources/User/authentication.ts";
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

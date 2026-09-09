import express from "express";
const router = express.Router();
import * as DashboardController from "./controller.ts";
import * as ClientController from "../../resources/Client/client-controller.ts";
import { authenticate } from "../../resources/User/user-authentication.ts";
import { saveLastPage } from "../../middlewares/saveLastPage.ts";

router.get(
  "/dashboard",
  saveLastPage,
  authenticate,
  DashboardController.showDashboard,
);

router.post("/addClient", authenticate, ClientController.addClient);
export default router;

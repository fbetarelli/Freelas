import express from "express";
const router = express.Router();
import * as DashboardController from  "../controllers/DashboardController.ts";
import * as ClientController from  "../controllers/ClientController.ts";
import { authenticate } from  "../middlewares/userAuth.ts";
import { saveLastPage } from  "../middlewares/saveLastPage.ts";

router.get(
  "/dashboard",
  saveLastPage,
  authenticate,
  DashboardController.showDashboard,
);

router.post("/addClient", authenticate, ClientController.addClient);
export default router;

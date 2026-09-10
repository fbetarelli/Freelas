import express from "express";
const router = express.Router();
import * as ClientController from "./client-controller.ts";
import * as JobController from "../Job/job-controller.ts";
import { authorize } from "./client-authentication.ts";
import { authenticate } from "../User/authentication.ts";
import { saveLastPage } from "../../middlewares/saveLastPage.ts";

router.get(
  "/client/:id",
  saveLastPage,
  authorize,
  ClientController.getClientPage,
);
router.post("/client/:id/edit", authorize, ClientController.editClient);
router.get("/client/:id/delete", authorize, ClientController.deleteClient);

router.post("/client/:id/addJob", authorize, JobController.addJob);

router.get("/clients", authenticate, ClientController.showClientList);

export default router;

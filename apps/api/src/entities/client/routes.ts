import express from "express";
const router = express.Router();
import * as ClientController from "./controller.ts";
import * as JobController from "../job/controller.ts";
import { authorize } from "./middleware/authentication.ts";
import { authenticate } from "../user/middleware/authentication.ts";
import { saveLastPage } from "../../middlewares/saveLastPage.ts";

export const clientRoutes = (app: express.Application) => {
  app.use("/", router);

  router.post("/addClient", authenticate, ClientController.addClient);
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
};

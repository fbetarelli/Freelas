import express from "express";
import * as JobController from "../job/controller.ts";
import { authenticate } from "../user/middleware/authentication.ts";
import * as ClientController from "./controller.ts";
import { authorize } from "./middleware/authentication.ts";
const router = express.Router();

export const clientRoutes = (app: express.Application) => {
  app.use("/", router);

  router.post("/add-client", authenticate, ClientController.addClient);
  router.get(
    "/client/:id",
    authorize,
    ClientController.getClientById,
  );
  router.patch("/client/:id/edit", authorize, ClientController.editClient);
  router.delete("/client/:id/delete", authorize, ClientController.deleteClient);

  router.post("/client/:id/addJob", authorize, JobController.addJob);

  router.get("/clients", authenticate, ClientController.showClientList);
};

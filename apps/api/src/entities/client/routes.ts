import express from "express";
import { authenticate } from "../user/middleware/authentication.ts";
import * as ClientController from "./controller.ts";
import { authorize } from "./middleware/authentication.ts";
const router = express.Router();

export const clientRoutes = (app: express.Application) => {
  app.use("/", router);

  router.post("/clients", authenticate, ClientController.addClient);
  router.get("/clients/:id", authorize, ClientController.getClientById);
  router.patch("/clients/:id", authorize, ClientController.editClient);
  router.delete("/clients/:id", authorize, ClientController.deleteClient);


  router.get("/clients", authenticate, ClientController.showClientList);
};

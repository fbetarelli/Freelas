import express from "express";
import { authenticate } from "../user/middleware/authentication.ts";
import * as ClientController from "./controller.ts";
import { authorize } from "./middleware/authentication.ts";
import { validate } from "../../middlewares/zodValidate.ts";
import {
  EditClientZodSchema,
  GetClientListZodSchema,
  GetClientZodSchema,
  RegisterClientZodSchema,
} from "@freelancemanager/shared";

const router = express.Router();

export const clientRoutes = (app: express.Application) => {
  app.use("/", router);

  router.post(
    "/clients",
    validate("body", RegisterClientZodSchema),
    authenticate,
    ClientController.addClient,
  );
  router.get(
    "/clients/:id",
    validate("params", GetClientZodSchema),
    authorize,
    ClientController.getClientById,
  );
  router.patch(
    "/clients/:id",
    validate("params", GetClientZodSchema),
    validate("body", EditClientZodSchema),
    authenticate,
    authorize,
    ClientController.editClient,
  );
  router.delete(
    "/clients/:id",
    validate("params", GetClientZodSchema),
    authorize,
    ClientController.deleteClient,
  );

  router.get(
    "/clients",
    validate("query", GetClientListZodSchema),
    authenticate,
    ClientController.showClientList,
  );
};

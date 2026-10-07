import {
  EditClientZodSchema,
  GetClientZodSchema,
  PaginatedSearchZodSchema,
  RegisterClientZodSchema,
} from "@freelancemanager/shared";
import express from "express";
import { validate } from "../../middlewares/zodValidate.ts";
import { authenticate } from "../../features/auth/middlewares/authentication.ts";
import * as ClientController from "./controller.ts";
import { authorize } from "./middleware/authentication.ts";

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
    authenticate,
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
    authenticate,
    authorize,
    ClientController.deleteClient,
  );

  router.get(
    "/clients",
    validate("query", PaginatedSearchZodSchema),
    authenticate,
    ClientController.showClientList,
  );
};

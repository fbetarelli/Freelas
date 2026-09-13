import express from "express";
const router = express.Router();
import { authenticate } from "./middleware/authentication.ts";
import * as UserController from "./controller.ts";

export const userRoutes = (app: express.Application) => {
  app.use("/", router);

  router.post("/login", UserController.login);

  router.post("/register", UserController.register);

  router.post("/logout", UserController.logout);

  router.patch("/edit-user", authenticate, UserController.editUser);
};

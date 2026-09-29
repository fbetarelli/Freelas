import express from "express";
const router = express.Router();
import { authenticate } from "./middleware/authentication.ts";
import * as UserController from "./controller.ts";
import { validate } from "../../middlewares/zodValidate.ts";
import {
  RegisterUserZodSchema,
  LoginUserZodSchema,
  EditUserZodSchema,
} from "@freelancemanager/shared";

export const userRoutes = (app: express.Application) => {
  app.use("/", router);

  router.post(
    "/login",
    validate("body", LoginUserZodSchema),
    UserController.login,
  );

  router.post(
    "/register",
    validate("body", RegisterUserZodSchema),
    UserController.register,
  );

  router.post("/logout", UserController.logout);

  router.patch(
    "/edit-user",
    validate("body", EditUserZodSchema),
    authenticate,
    UserController.editUser,
  );
};

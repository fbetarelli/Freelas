import express from "express";
const router = express.Router();
import { authenticate } from "./user-authentication.ts";
import * as UserController from "./user-controller.ts";

router.get("/login", UserController.showLogin);
router.post("/login", UserController.login);

router.get("/register", UserController.showRegister);
router.post("/register", UserController.register);

router.get("/logout", UserController.logout);

router.get("/profile", authenticate, UserController.showProfile);
router.post("/profile/edit", authenticate, UserController.editUser);

export default router;

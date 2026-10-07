import express from "express";
import { authorizeMaterialOwner } from "../../middlewares/authorizeOwnerViaJob.ts";
import { authorize } from "../job/middleware/authentication.ts";
import { authenticate } from "../user/middleware/authentication.ts";
import * as MaterialController from "../material/controller.ts";
import { validate } from "../../middlewares/zodValidate.ts";
import {
  EditMaterialZodSchema,
  GetJobZodSchema,
  GetMaterialZodSchema,
  RegisterMaterialZodSchema,
} from "@freelancemanager/shared";
const router = express.Router();
export const materialRoutes = (app: express.Application) => {
  app.use("/", router);

  router.post(
    "/jobs/:id/materials",
    validate("params", GetJobZodSchema),
    validate("body", RegisterMaterialZodSchema),
    authenticate,
    authorize,
    MaterialController.addMaterial,
  );
  router.get(
    "/jobs/:id/materials",
    validate("params", GetJobZodSchema),
    authenticate,
    authorize,
    MaterialController.getMaterialsByJob,
  );
  router.patch(
    "/materials/:id",
    validate("params", GetMaterialZodSchema),
    validate("body", EditMaterialZodSchema),
    authenticate,
    authorizeMaterialOwner,
    MaterialController.editMaterial,
  );
  router.delete(
    "/materials/:id",
    validate("params", GetMaterialZodSchema),
    authenticate,
    authorizeMaterialOwner,
    MaterialController.deleteMaterial,
  );
};

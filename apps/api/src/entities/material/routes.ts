import express from "express";
import { authorizeMaterialOwner } from "../../middlewares/authorizeOwnerViaJob.ts";
import { authorize } from "../job/middleware/authentication.ts";
import * as MaterialController from "../material/controller.ts";
const router = express.Router();
export const materialRoutes = (app: express.Application) => {
  app.use("/", router);

  router.post("/jobs/:id/materials", authorize, MaterialController.addMaterial);
  router.get("/jobs/:id/materials", authorize, MaterialController.getMaterialsByJob);
  router.patch(
    "/materials/:id",
    authorizeMaterialOwner,
    MaterialController.editMaterial,
  );
  router.delete(
    "/materials/:id",
    authorizeMaterialOwner,
    MaterialController.deleteMaterial,
  );
};

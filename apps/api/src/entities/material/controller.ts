import type { RegisterMaterial } from "@freelancemanager/shared";
import { type Request } from "express";
import { assertIsString } from "../../utils/assert-is-string.ts";
import { asyncHandler } from "../../utils/asyncHandler.ts";
import * as MaterialServices from "./services.ts";

type RequestWithMaterialBody = Request<
  { id: string },
  unknown,
  RegisterMaterial
>;

export const addMaterial = asyncHandler(
  async (req: RequestWithMaterialBody, res) => {
    const jobId = req.params.id;

    assertIsString(jobId, "Job Id");
    const material = {
      ...req.body,
      jobId,
    };

    const materialAdded = await MaterialServices.addMaterial(material);
    res.status(200).json(materialAdded);
  },
);

export const getMaterialsByJob = asyncHandler(
  async (req: Request<{ id: string }>, res) => {
    const jobId = req.params.id;
    assertIsString(jobId, "Job Id");
    const { materials, totalValue } =
      await MaterialServices.getMaterialsByJob(jobId);
    res.status(200).json({ materials, totalValue });
  },
);

export const editMaterial = asyncHandler(
  async (req: RequestWithMaterialBody, res) => {
    assertIsString(req.params.id, "Material Id");

    const material = {
      descr: req.body.descr,
      supplier: req.body.supplier,
      qnt: req.body.qnt,
      id: req.params.id,
      unitaryVal: req.body.unitaryVal,
    };

    const updatedMaterial = await MaterialServices.editMaterial(material);
    res.status(200).json(updatedMaterial);
  },
);

export const deleteMaterial = asyncHandler(
  async (req: Request<{ id: string }>, res) => {
    assertIsString(req.params.id, "Material Id");
    await MaterialServices.deleteMaterial(req.params.id);
    res.sendStatus(204);
  },
);

import { type Request } from "express";
import { assertIsString } from "../../utils/assert-is-string.ts";
import { asyncHandler } from "../../utils/asyncHandler.ts";
import { formatValueToFloat } from "../../utils/formatting-helpers.ts";
import * as MaterialServices from "./services.ts";
import { type Material } from "./types.ts";

interface RequestMaterial extends Omit<
  Material,
  "id" | "jobId" | "unitaryVal"
> {
  unitaryVal: string;
}

type RequestWithMaterialBody = Request<
  { id: string },
  unknown,
  RequestMaterial
>;

export const addMaterial = asyncHandler(
  async (req: RequestWithMaterialBody, res) => {
    const formattedUnitaryVal = formatValueToFloat(req.body.unitaryVal);
    const jobId = req.params.id;

    assertIsString(jobId, "Job Id");
    const material = {
      ...req.body,
      unitaryVal: formattedUnitaryVal,
      jobId,
    };

    await MaterialServices.addMaterial(material);
    res.redirect(`/job/${req.params.id}`);
  },
);
// get materials by job

export const editMaterial = asyncHandler(
  async (
    req: Request<{ id: string; materialid: string }, unknown, RequestMaterial>,
    res,
  ) => {
    let valorUnitario;
    if (req.body.unitaryVal) {
      valorUnitario = formatValueToFloat(req.body.unitaryVal);
    }

    assertIsString(req.params.materialid, "Material Id");
    assertIsString(req.params.id, "Job Id");

    const material = {
      ...req.body,
      id: req.params.materialid,
      jobId: req.params.id,
      unitaryVal: valorUnitario,
    };

    await MaterialServices.editMaterial(material);
    res.redirect(`/job/${req.params.id}`);
  },
);

export const deleteMaterial = asyncHandler(
  async (req: Request<{ id: string; materialid: string }>, res) => {
    assertIsString(req.params.materialid, "Material Id");
    await MaterialServices.deleteMaterial(req.params.materialid);
    res.redirect(`/job/${req.params.id}`);
  },
);

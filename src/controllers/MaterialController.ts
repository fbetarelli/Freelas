import { Material } from "../models/Material.ts";
import * as MaterialServices from "../services/MaterialServices.ts";
import { asyncHandler } from "../utils/asyncHandler.ts";
import { assertIsString } from "../utils/assert-is-string.ts";
import { formatarParaFloat } from "../utils/formattingHelpers.ts";

export const addMaterial = asyncHandler(async (req, res) => {
  const valorUnitario = formatarParaFloat(req.body.unitaryVal);
  const jobId = req.params.id;

  assertIsString(jobId, "Job Id");

  const material = new Material({
    id: "",
    supplier: req.body.supplier,
    descr: req.body.descr,
    qnt: req.body.qnt,
    unitaryVal: valorUnitario,
    jobId,
  });

  await MaterialServices.addMaterial(material);
  res.redirect(`/job/${req.params.id}`);
});
export const editMaterial = asyncHandler(async (req, res) => {
  let valorUnitario;
  if (req.body.unitaryVal) {
    valorUnitario = formatarParaFloat(req.body.unitaryVal);
  }

  assertIsString(req.params.materialid, "Material Id");
  assertIsString(req.params.jobId, "Job Id");

  const material = new Material({
    id: req.params.materialid,
    supplier: req.body.supplier,
    descr: req.body.descr,
    qnt: req.body.qnt,
    jobId: req.params.jobId,
    //@ts-ignore
    unitaryVal: valorUnitario,
  });

  await MaterialServices.editMaterial(material);
  res.redirect(`/job/${req.params.id}`);
});

export const deleteMaterial = asyncHandler(async (req, res) => {
  assertIsString(req.params.materialid, "Material Id");
  await MaterialServices.deleteMaterial(req.params.materialid);
  res.redirect(`/job/${req.params.id}`);
});

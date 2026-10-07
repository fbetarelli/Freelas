import { removeUndefined } from "../../utils/remove-undefined.ts";
import { ApiError } from "../errors/errors.ts";
import { MaterialDAO } from "./dao.ts";
import { type Material } from "./types.ts";
import { toFormattedMaterial } from "./utils/mapper.ts";

const dao = new MaterialDAO();

export const addMaterial = async (material: Omit<Material, "id">) => {
  const dbMaterial = await dao.addMaterial(material);
  if (dbMaterial === null) {
    throw new ApiError(500, "Failed to add material");
  }
  return toFormattedMaterial(dbMaterial);
};
export const editMaterial = async (
  incomingMaterial: Partial<Material> & { id: string },
) => {
  const { id, descr, supplier, qnt, unitaryVal } = incomingMaterial;

  const materialWithoutId = removeUndefined({
    descr: descr?.trim() !== "" ? descr?.trim() : undefined,
    supplier: supplier?.trim() !== "" ? supplier?.trim() : undefined,
    qnt: qnt !== undefined ? qnt : undefined,
    unitaryVal: unitaryVal !== undefined ? unitaryVal : undefined,
  });

  const material = {
    id,
    ...materialWithoutId,
  };

  const dbMaterial = await dao.editMaterial(material);
  if (dbMaterial === null) {
    throw new ApiError(500, "Failed to edit material");
  }
  return toFormattedMaterial(dbMaterial);
};

export const deleteMaterial = async (materialId: string) => {
  return await dao.deleteMaterial(materialId);
};

export const getTotalFromLastMonth = async (userId: string) => {
  return await dao.getTotalFromLastMonth(userId);
};

export const getMaterialsByJob = async (jobId: string) => {
  const res = await dao.getMaterialsByJob(jobId);

  const totalValue = res.reduce((acc, material) => {
    return acc + Number(material.qnt) * Number(material.unitaryval);
  }, 0);

  const materials = res.map(toFormattedMaterial);

  return { materials, totalValue };
};

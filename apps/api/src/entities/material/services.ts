import { NotFoundError } from "../errors/errors.ts";
import { MaterialDAO } from "./dao.ts";
import { type Material } from "./types.ts";
import { toFormattedMaterial } from "./utils/mapper.ts";

const dao = new MaterialDAO();

export const addMaterial = async (
  material: Omit<Material, "id">,
  userId: string,
) => {
  const dbMaterial = await dao.addMaterial(material, userId);
  if (dbMaterial === null) {
    throw new NotFoundError("Job not found");
  }
  return toFormattedMaterial(dbMaterial);
};
export const editMaterial = async (
  incomingMaterial: Partial<Material> & { id: string },
  userId: string,
) => {
  const { id, descr, supplier, qnt, unitaryVal } = incomingMaterial;

  const materialWithoutId = { descr, supplier, qnt, unitaryVal };

  const material = {
    id,
    ...materialWithoutId,
  };

  const dbMaterial = await dao.editMaterial(material, userId);
  if (dbMaterial === null) {
    throw new NotFoundError("Material not found");
  }
  return toFormattedMaterial(dbMaterial);
};

export const deleteMaterial = async (materialId: string, userId: string) => {
  const deleted = await dao.deleteMaterial(materialId, userId);
  if (!deleted) throw new NotFoundError("Material not found");
};

export const getTotalFromLastMonth = async (userId: string) => {
  return await dao.getTotalFromLastMonth(userId);
};

export const getMaterialsByJob = async (jobId: string, userId: string) => {
  const res = await dao.getMaterialsByJob(jobId, userId);
  if (res === null) throw new NotFoundError("Job not found");

  const totalValue = res.reduce((acc, material) => {
    return acc + Number(material.qnt) * Number(material.unitaryval);
  }, 0);

  const materials = res.map(toFormattedMaterial);

  return { materials, totalValue };
};

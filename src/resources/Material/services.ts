import { formatarValor } from "../../utils/formattingHelpers.ts";
import { MaterialDAO } from "./dao.ts";
import { type Material } from "./types.ts";

const dao = new MaterialDAO();

export const addMaterial = async (material: Omit<Material, "id">) => {
  return await dao.addMaterial(material);
};
export const editMaterial = async (
  material: Partial<Material> & { id: string },
) => {
  return await dao.editMaterial(material);
};

export const deleteMaterial = async (materialId: string) => {
  return await dao.deleteMaterial(materialId);
};

export const getTotalFromLastMonth = async (userId: string) => {
  return await dao.getTotalFromLastMonth(userId);
};

export const getMaterialsByJob = async (jobId: string) => {
  const materialArr = await dao.getMaterialsByJob(jobId);

  const totalValue = materialArr.reduce((acc, material) => {
    return acc + material.qnt * material.unitaryVal;
  }, 0);

  const formattedMaterialArr = materialArr.map((material) => {
    return {
      ...material,
      unitaryVal: formatarValor(material.unitaryVal),
      totalVal: formatarValor(material.qnt * material.unitaryVal),
    };
  });

  return { data: formattedMaterialArr, totalValue };
};

import { MaterialDAO } from "../repositories/MaterialDAO.ts";
import { Material } from "../models/Material.ts";
import { runDAO } from "../utils/serviceHelper.ts";
import { toDTO } from "../mappers/MaterialMapper.ts";

const dao = new MaterialDAO();

export const addMaterial = async (material: Material) => {
  return runDAO(dao, "addMaterial", material);
};
export const editMaterial = async (material: Material) => {
  return runDAO(dao, "editMaterial", material);
};
export const deleteMaterial = async (materialId: string) => {
  return runDAO(dao, "deleteMaterial", materialId);
};

export const getMaterialsByJob = async (jobId: string) => {
  return runDAO(
    dao,
    "getMaterialsByJob",
    jobId,
    toDTO,
    "materials",
    true,
    "totalVal",
  );
};

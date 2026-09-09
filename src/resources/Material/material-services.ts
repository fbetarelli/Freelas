import { runDAO } from "../../utils/serviceHelper.ts";
import { MaterialDAO } from "./material-DAO.ts";
import { toDTO } from "./material-mapper.ts";
import { Material } from "./types.ts";

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

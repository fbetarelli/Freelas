const MaterialDAO = require('../repositories/MaterialDAO');
const { runDAO } = require('../utils/serviceHelper');
const { toDTO } = require("../mappers/MaterialMapper")

const dao = new MaterialDAO;

exports.addMaterial = async (material) => {
    return runDAO(dao, "addMaterial", material);
}
exports.editMaterial = async (material) => {
    return runDAO(dao, "editMaterial", material);
}
exports.deleteMaterial = async (materialId) => {
    return runDAO(dao, "deleteMaterial", materialId);
}

exports.getMaterialsByJob = async (jobId) => {
    return runDAO(dao, "getMaterialsByJob", jobId, toDTO, "materials", true, "totalVal");
}


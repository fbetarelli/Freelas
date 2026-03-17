const MaterialDTO = require('../DTO/MaterialDTO');
const Material = require('../models/Material');
const MaterialDAO = require('../repositories/MaterialDAO');
const {  formatarValor } = require('../utils/formattingHelpers');

exports.addMaterial = async (material) => {
    console.log('rodou add material service')
    let dao = new MaterialDAO;
    try {
        await dao.addMaterial(material);
        console.log('sucesso service')
        return { success: true }


    } catch (error) {

        return { success: false, errMsg: error };
    }
}
exports.editMaterial = async (material) => {
    let dao = new MaterialDAO;
    try {
        await dao.editMaterial(material);
        return { success: true }


    } catch (error) {

        return { success: false, errMsg: error };
    }
}
exports.deleteMaterial = async (materialid) => {
    let dao = new MaterialDAO;
    try {
        await dao.deleteMaterial(materialid);
        return { success: true }


    } catch (error) {

        return { success: false, errMsg: error };
    }
}

exports.getMaterialsByJob = async (jobId) => {
    let dao = new MaterialDAO;
    try {

        const result = await dao.getMaterialsByJob(jobId)
        const DTOArray = []
        let totalMateriais = 0;

        if (result && result.length > 0) {
            let index = 1;
            result.forEach(entity => {
                let dto = toDTO(entity, jobId)
                totalMateriais += dto.totalVal;
                DTOArray.push(dto)
            })
        }


        return { success: true, materials: DTOArray, materialsVal: formatarValor(totalMateriais) }

    } catch (error) {

        return { success: false, errMsg: error };
    }
}


function toDTO(obj, jobId) {
    let valorUni = formatarValor(obj.getUnitaryValue())
    let dto = new MaterialDTO({

        id: obj.getId(),
        descr: obj.getDescription(),
        supplier: obj.getSupplier(),
        qnt: obj.getQuantity(),
        unitaryVal: valorUni,
        totalVal: (obj.getUnitaryValue() * obj.getQuantity()),
        jobId: jobId,

    })

    return dto
}
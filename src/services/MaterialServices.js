const MaterialDTO = require('../DTO/MaterialDTO');
const Material = require('../models/Material');
const MaterialDAO = require('../repositories/MaterialDAO');

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

        if (result && result.length > 0) {

            let index = 1;
            result.forEach(entity => {

                let dto = new MaterialDTO({

                    id: entity.getId(),
                    descr: entity.getDescription(),
                    supplier: entity.getSupplier(),
                    qnt: entity.getQuantity(),
                    unitaryVal: entity.getUnitaryValue(),
                    jobId: jobId,
                })

                DTOArray.push(dto)
            })
        }

        return { success: true, materials: DTOArray }

    } catch (error) {

        return { success: false, errMsg: error };
    }
}

function formatarValor(val) {
    //formata numero para separar casas.
    const numeroFormatado = new Intl.NumberFormat(navigator.language, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(val);

    return numeroFormatado
}

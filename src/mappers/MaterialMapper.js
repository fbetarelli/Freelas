const { formatarValor } = require("../utils/formattingHelpers")
const MaterialDTO = require('../DTO/MaterialDTO')

function toDTO(obj, jobId) {
    let valorUni = formatarValor(obj.getUnitaryValue())
    let dto = new MaterialDTO({

        id: obj.getId(),
        descr: obj.getDescription(),
        supplier: obj.getSupplier(),
        qnt: obj.getQuantity(),
        unitaryVal: valorUni,
        totalVal: formatarValor((obj.getUnitaryValue() * obj.getQuantity())),
        jobId: jobId,

    })

    return dto
}

module.exports = { toDTO }
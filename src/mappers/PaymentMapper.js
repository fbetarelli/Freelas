const { formatarData, formatarValor } = require("../utils/formattingHelpers")
const PaymentDTO = require('../DTO/PaymentDTO')

function toDTO(obj) {
    let dto = new PaymentDTO({
        id: obj.getId(),
        method: obj.getMethod(),
        paymentDate: formatarData(obj.getPaymentDate()),
        value: formatarValor(obj.getValue()),
        installment: obj.getInstallment(),
        jobId: obj.getJobId()
    })
    return dto
}

module.exports = { toDTO }
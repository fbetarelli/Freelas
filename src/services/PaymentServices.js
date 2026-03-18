const PaymentDTO = require('../DTO/PaymentDTO');
const Payment = require('../models/Payment');
const PaymentDAO = require('../repositories/PaymentDAO')
const { runDAO } = require('../utils/serviceHelper');
const { formatarData, formatarValor } = require('../utils/formattingHelpers');

const dao = new PaymentDAO;

exports.addPayment = async (payment) => {
    return runDAO(dao, "addPayment", payment);
}
exports.editPayment = async (payment) => {
    return runDAO(dao, "editPayment", payment);
}
exports.deletePayment = async (paymentId) => {
    return runDAO(dao, "deletePayment", paymentId);
}


exports.getPaymentsByJob = async (jobId) => {
    let dao = new PaymentDAO;
    try {
        let totalValue = 0
        const result = await dao.getPaymentsByJob(jobId)
        const DTOArray = []

        if (result && result.length > 0) {

            result.forEach(entity => {
                let dto = toDTO(entity)
                totalValue += entity.getValue()
                DTOArray.push(dto)
            })
        }

        return { success: true, payments: DTOArray, paymentsVal: totalValue }

    } catch (error) {

        return { success: false, errMsg: error };
    }
}


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
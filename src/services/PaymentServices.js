const PaymentDAO = require('../repositories/PaymentDAO')
const { runDAO } = require('../utils/serviceHelper');
const { toDTO } = require('../mappers/PaymentMapper')

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
    return runDAO(dao, "getPaymentsByJob", jobId, toDTO, "payments", true, "value",);
}


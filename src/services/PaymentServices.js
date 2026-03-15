const PaymentDTO = require('../DTO/PaymentDTO');
const Payment = require('../models/Payment');
const PaymentDAO = require('../repositories/PaymentDAO')

exports.addPayment = async (payment) => {
    console.log('rodou add payment service')
    let dao = new PaymentDAO;
    try {
        await dao.addPayment(payment);
        console.log('sucesso service')
        return { success: true }


    } catch (error) {

        return { success: false, errMsg: error };
    }
}
exports.editPayment = async (payment) => {
    let dao = new PaymentDAO;
    try {
        await dao.editPayment(payment);
        return { success: true }


    } catch (error) {

        return { success: false, errMsg: error };
    }
}
exports.deletePayment = async (paymentid) => {
    let dao = new PaymentDAO;
    try {
        await dao.deletePayment(paymentid);
        return { success: true }


    } catch (error) {

        return { success: false, errMsg: error };
    }
}

exports.getPaymentsByJob = async (jobId) => {
    let dao = new PaymentDAO;
    try {

        const result = await dao.getPaymentsByJob(jobId)
        const DTOArray = []

        if (result && result.length > 0) {

            let index = 1;
            result.forEach(entity => {

                let dto = new PaymentDTO({
                    id: entity.getId(),
                    method: entity.getMethod(),
                    paymentDate: formatarData(entity.getPaymentDate()),
                    value: entity.getValue(),
                    installment: entity.getInstallment(),
                    jobId: entity.getJobId()
                })

                DTOArray.push(dto)
            })
        }

        return { success: true, payments: DTOArray }

    } catch (error) {

        return { success: false, errMsg: error };
    }
}
function formatarData(data) {
    const dateFromDB = new Date(data);

    // Formatar para PT-BR (12/03/2026)
    const formattedDate = dateFromDB.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
    return formattedDate;
}

function formatarValor(val) {
    //formata numero para separar casas.
    const numeroFormatado = new Intl.NumberFormat(navigator.language, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(val);

    return numeroFormatado
}

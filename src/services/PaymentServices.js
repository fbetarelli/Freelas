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

        return { success: true, payments: DTOArray, paymentsVal: formatarValor(totalValue) }

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
    const numeroFormatado = new Intl.NumberFormat('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(val);

    return numeroFormatado
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
class PaymentDTO {
    id
    method
    paymentDate
    value
    installment
    jobId

    constructor({ id, method, paymentDate, value, installment, jobId }) {
        this.id = id
        this.method = method
        this.paymentDate = paymentDate
        this.value = value
        this.installment = installment
        this.jobId = jobId
    }

    getId() { return this.id }

    getMethod() { return this.method }

    getPaymentDate() { return this.paymentDate }

    getValue() { return this.value }

    getInstallment() { return this.installment }

    getJobId() { return this.jobId }


}

module.exports = PaymentDTO;
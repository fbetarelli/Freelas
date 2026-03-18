const Payment = require('../models/Payment')
const PaymentServices = require('../services/PaymentServices');
const asyncHandler = require('../utils/asyncHandler');
const { formatarParaFloat } = require('../utils/formattingHelpers')

exports.addPayment = asyncHandler(async (req, res) => {
    const valor = formatarParaFloat(req.body.value)
    const payment = new Payment({
        method: req.body.method,
        paymentDate: req.body.paymentDate,
        value: valor,
        installment: req.body.installment,
        jobId: req.params.id
    })

    PaymentServices.addPayment(payment);
    res.redirect(`/job/${req.params.id}`)
})

exports.editPayment = asyncHandler(async (req, res) => {
    let valor;
    if (req.body.value) {
        valor = formatarParaFloat(req.body.value)
    }

    const payment = ({
        id: req.params.paymentid,
        method: req.body.method,
        paymentDate: req.body.paymentDate,
        value: valor,
        installment: req.body.installment,
        jobId: req.params.id
    })

    await PaymentServices.editPayment(payment);
    res.redirect(`/job/${req.params.id}`)

})
exports.deletePayment = asyncHandler(async (req, res) => {
    await PaymentServices.deletePayment(req.params.paymentid);
    res.redirect(`/job/${req.params.id}`)

})


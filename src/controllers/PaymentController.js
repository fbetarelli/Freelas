const Payment = require('../models/Payment')
const PaymentServices = require('../services/PaymentServices');

exports.addPayment = async (req, res) => {
    console.log('rodou add payment')
    try {
        //tira os pontos da string ex: 199,99
        const temp = req.body.value.replace(/\./g, '')
        const valor = parseFloat(temp.replace(/,/g, '.'))



        const payment = new Payment({
            method: req.body.method,
            paymentDate: req.body.paymentDate,
            value: valor,
            installment: req.body.installment,
            jobId: req.params.id
        })

        const result = await PaymentServices.addPayment(payment);
        if (result.success) {
            console.log('result success')
            res.redirect(`/job/${req.params.id}`)
        }
    } catch (error) {
        console.log('result erro')
        res.render('erro', { errMsg: error })
    }

}
exports.editPayment = async (req, res) => {
    console.log('rodou')
    try {
        let valor;
        //tira os pontos da string ex: 199,99
        if (req.body.value) {
            const temp = req.body.value.replace(/\./g, '')
            valor = temp.replace(/,/g, '.')
        }


        const payment = ({
            id: req.params.paymentid,
            method: req.body.method,
            paymentDate: req.body.paymentDate,
            value: valor,
            installment: req.body.installment,
            jobId: req.params.id
        })

        const result = await PaymentServices.editPayment(payment);
        if (result.success) {

            res.redirect(`/job/${req.params.id}`)
        }
    } catch (error) {
        console.log('result erro')
        res.render('erro', { errMsg: error })
    }

}
exports.deletePayment = async (req, res) => {
    console.log('rodou')
    try {

        const result = await PaymentServices.deletePayment(req.params.paymentid);
        if (result.success) {

            res.redirect(`/job/${req.params.id}`)
        }
    } catch (error) {
        console.log('result erro')
        res.render('erro', { errMsg: error })
    }

}


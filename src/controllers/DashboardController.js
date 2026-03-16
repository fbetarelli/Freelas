const ClientServices = require('../services/ClientServices')
const JobServices = require('../services/JobServices')
const PaymentServices = require('../services/PaymentServices')

exports.showDashboard = async (req, res) => {
    try {
        const clientsResult = await ClientServices.getClients(req.session.user.id);
        const jobsResult = await JobServices.getLastJobsByUser(req.session.user.id)
        //const paymentsResult = await JobServices.getUserProfitByLast30Days(req.session.user.id)

        if (clientsResult.success && jobsResult.success /*&& paymentsResult.success*/) {
            res.render('dashboard', { clients: clientsResult.clients, jobs: jobsResult.jobs, /*payments: paymentsResult.payments,*/ username: req.session.user.username })
        } else {
            res.render('erro', { errorMessage: clientsResult.errMsg || jobsResult.errMsg })
        }
    } catch (error) {
        console.error('Erro no getClient controller ' + error)
    }

}

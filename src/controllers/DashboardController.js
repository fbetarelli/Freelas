const ClientServices = require('../services/ClientServices')
const JobServices = require('../services/JobServices')
const UserServices = require('../services/UserServices')

exports.showDashboard = async (req, res) => {
    try {
        const clientsResult = await ClientServices.getClients(req.session.user.id);
        const jobsResult = await JobServices.getLastJobsByUser(req.session.user.id)
        const userResult = await UserServices.getProfitFromLastMonth(req.session.user.id)

        if (clientsResult.success && jobsResult.success && userResult.success) {
            res.render('dashboard', {
                clients: clientsResult.clients, jobs: jobsResult.jobs,
                profit: userResult.profit, username: req.session.user.username
            })
        } else {
            res.render('erro', { errorMessage: clientsResult.errMsg || jobsResult.errMsg || userResult.errMsg })
        }
    } catch (error) {
        console.error('Erro no getClient controller ' + error)
    }

}

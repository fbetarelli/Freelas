const ClientServices = require('../services/ClientServices')
const JobServices = require('../services/JobServices')
const UserServices = require('../services/UserServices')
const asyncHandler = require('../utils/asyncHandler');

exports.showDashboard = asyncHandler(async (req, res) => {

    const clientsResult = await ClientServices.getLatestClients(req.session.user.id);
    const jobsResult = await JobServices.getLastJobsByUser(req.session.user.id)
    const userResult = await UserServices.getProfitFromLastMonth(req.session.user.id)


    res.render('dashboard', {
        clients: clientsResult.clients, jobs: jobsResult.jobs,
        profit: userResult.profit, username: req.session.user.username
    })

})
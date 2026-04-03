const ClientServices = require('../services/ClientServices')
const JobServices = require('../services/JobServices')
const UserServices = require('../services/UserServices')
const asyncHandler = require('../utils/asyncHandler');

exports.showDashboard = asyncHandler(async (req, res) => {

    const clients = await ClientServices.getLatestClients(req.session.user.id);
    const jobs = await JobServices.getLastJobsByUser(req.session.user.id);
    const user = await UserServices.getProfitFromLastMonth(req.session.user.id);
    const lastJobs = await UserServices.getJobCount(req.session.user.id);


    res.render('dashboard', {
        clients: clients.clients, jobs: jobs.jobs,
        profit: user.profit, username: req.session.user.username, count: lastJobs
    })

})
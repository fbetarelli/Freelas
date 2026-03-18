const Client = require('../models/Client');
const ClientServices = require('../services/ClientServices')
const JobServices = require('../services/JobServices')
const asyncHandler = require('../utils/asyncHandler');


exports.addClient = asyncHandler(async (req, res) => {
    const client = new Client({
        name: req.body.name,
        address: req.body.address,
        contact: req.body.contact,
        userId: req.session.user.id
    })
    await ClientServices.addClient(client);

    res.redirect('dashboard')

})

exports.editClient = asyncHandler(async (req, res) => {
    const client = ({
        id: req.params.id,
        name: req.body.name,
        address: req.body.address,
        contact: req.body.contact
    })

    await ClientServices.editClient(client);
    res.redirect(`/client/${req.params.id}`)

})

exports.deleteClient = asyncHandler(async (req, res) => {
    const clientId = req.params.id

    await ClientServices.deleteClient(clientId);
    res.redirect('/dashboard')
})

exports.getClientPage = asyncHandler(async (req, res) => {
    const clientId = req.params.id;

    const clientResult = await ClientServices.getClientById(clientId);
    const jobsResult = await JobServices.getJobsByClient(clientId);

    res.render('clientPage', { client: clientResult.client, jobs: jobsResult.jobsArray })

})


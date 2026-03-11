const Client = require('../models/Client');
const ClientServices = require('../services/ClientServices')
const JobServices = require('../services/JobServices')

exports.addClient = async (req, res) => {
    const client = new Client({
        name: req.body.name,
        address: req.body.address,
        contact: req.body.contact,
        userId: req.session.user.id
    })

    try {
        const result = await ClientServices.addClient(client);

        if (result.success) {
            res.redirect('dashboard')
        } else {
            res.render('erro', { errorMessage: result.errMsg })
        }
    } catch (error) {
        console.error('Erro no addClient controller ' + error)
    }
}
exports.editClient = async (req, res) => {
    const client = ({
        id: req.params.id,
        name: req.body.name,
        address: req.body.address,
        contact: req.body.contact
    })

    try {
        const result = await ClientServices.editClient(client);

        if (result.success) {
            res.redirect(`/client/${req.params.id}`)
        } else {
            res.render('erro', { errorMessage: result.errMsg })
        }
    } catch (error) {
        console.error('Erro no addClient controller ' + error)
    }
}


exports.getClients = async (req, res) => {
    try {

        const result = await ClientServices.getClients(req.session.user.id);

        if (result.success) {
            return ({
                success: true,
                clients: result.clients
            })


        } else {
            res.render('erro', { errorMessage: result.errMsg })
        }
    } catch (error) {
        console.error('Erro no getClient controller ' + error)
    }
}

exports.getClientPage = async (req, res) => {
    const clientId = req.params.id;

    try {
        const clientResult = await ClientServices.getClientById(clientId);
        const jobsResult = await JobServices.getJobsByClient(clientId);

        if (clientResult.success && jobsResult.success) {
            res.render('clientPage', { client: clientResult.client, jobs: jobsResult.jobsArray })

        } else {
            res.render('erro', { errorMessage: clientResult.errMsg || jobsResult.errMsg })
        }
    } catch (error) {
        console.error('Erro no getClientPage controller ' + error)
    }

}


const Client = require('../models/Client');
const ClientServices = require('../services/ClientServices')

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


exports.getClients = async (req, res) => {
    try {

        const result = await ClientServices.getClients(req.session.user.id);

        if (result.success) {
            res.json({
                success: true,
                //transforma obj de classe privada em obj json, impedindo o objeto de ser salvo sem dados
                clients: result.clientsArray.map(c => c.toJSON())
            })
        } else {
            res.render('erro', { errorMessage: result.errMsg })
        }
    } catch (error) {
        console.error('Erro no getClient controller ' + error)
    }
}
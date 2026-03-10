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
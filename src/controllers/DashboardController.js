const ClientServices = require('../services/ClientServices')

exports.showDashboard = async (req, res) => {
    try {
        const result = await ClientServices.getClients(req.session.user.id);

        if (result.success) {
            res.render('dashboard', { clients: result.clientsArray })
        } else {
            res.render('erro', { errorMessage: result.errMsg })
        }
    } catch (error) {
        console.error('Erro no getClient controller ' + error)
    }

}

const ClientDAO = require('../repositories/ClientDAO')

async function authorize(req, res, next) {
    let dao = new ClientDAO;
    let client = await dao.getClientById(req.params.id)
    if (client && req.session.user && req.session.user.id === client.getUserId()) {

        return next()
    }
    else {

        const err = new Error()
        err.customMessage = 'Acesso Proibido';
        err.code = 401;

        return next(err)
    }

}

module.exports = authorize;
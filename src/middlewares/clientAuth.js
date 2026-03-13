const ClientDAO = require('../repositories/ClientDAO')

async function authorize(req, res, next) {
    let dao = new ClientDAO;
    let client = await dao.getClientById(req.params.id)
    if (req.session.user && req.session.user.id === client.getUserId()) {
        req.session.returnTo = req.originalUrl;
        console.log(req.originalUrl)
        next()
    }
    else {
        res.redirect('/')
    }

}

module.exports = authorize;
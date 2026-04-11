const JobDAO = require('../repositories/JobDAO')

async function authorize(req, res, next) {
    let dao = new JobDAO;
    let job = await dao.getJobById(req.params.id)
    if (job && req.session.user && req.session.user.id === job.getUserId()) {
        next()
    }
    else {
        const err = new Error()
        err.customMessage = 'Acesso Proibido';
        err.code = 401;
        return next(err)
    }
}

module.exports = authorize;
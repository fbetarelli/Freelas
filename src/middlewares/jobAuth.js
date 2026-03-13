const JobDAO = require('../repositories/JobDAO')

async function authorize(req, res, next) {
    let dao = new JobDAO;
    try {
        let job = await dao.getJobById(req.params.id)
        console.log(job.getUserId())
        console.log(req.session.user.id)
        if (job && req.session.user && req.session.user.id === job.getUserId()) {
            console.log(req.originalUrl)
            next()
        }
        else {
            res.redirect('/')
        }
    } catch (error) {
        res.redirect('/')
    }


}

module.exports = authorize;
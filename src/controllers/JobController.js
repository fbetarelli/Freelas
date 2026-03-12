const Job = require('../models/Job')
const JobServices = require('../services/JobServices');

exports.addJob = async (req, res) => {
    console.log('rodou')
    try {
        const job = new Job({
            descr: req.body.descr,
            jobDate: req.body.date,
            totalValue: req.body.totalValue,
            clientId: req.params.id,
            userId: req.session.user.id
        })

        const result = await JobServices.addJob(job);
        if (result.success) {
            console.log('result success')
            res.redirect(`/client/${req.params.id}`)
        }
    } catch (error) {
        console.log('result erro')
        res.render('erro', { errMsg: error })
    }

}
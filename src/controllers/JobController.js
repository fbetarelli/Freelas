const Job = require('../models/Job')
const JobServices = require('../services/JobServices');

exports.addJob = async (req, res) => {
    console.log('rodou')
    try {
        //tira os pontos da string ex: 199,99
        const temp = req.body.totalValue.replace(/\./g, '')
        const valorTotal = temp.replace(/,/g, '.')


        const job = new Job({
            descr: req.body.descr,
            jobDate: req.body.date,
            totalValue: parseFloat(valorTotal),
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
exports.editJob = async (req, res) => {
    console.log('rodou')
    try {
        let valorTotal;
        //tira os pontos da string ex: 199,99
        if (req.body.totalValue) {
            const temp = req.body.totalValue.replace(/\./g, '')
            valorTotal = parseFloat(temp.replace(/,/g, '.'))
        }


        const job = ({
            id: req.params.id,
            descr: req.body.descr,
            jobDate: req.body.date,
            totalValue: valorTotal,
        })

        const result = await JobServices.editJob(job);
        if (result.success) {

            res.redirect(`/job/${req.params.id}`)
        }
    } catch (error) {
        console.log('result erro')
        res.render('erro', { errMsg: error })
    }

}
exports.deleteJob = async (req, res) => {
    console.log('rodou')
    try {

        const result = await JobServices.deleteJob(req.params.id);
        if (result.success) {

            res.redirect(req.session.returnTo)
        }
    } catch (error) {
        console.log('result erro')
        res.render('erro', { errMsg: error })
    }

}
exports.getJobPage = async (req, res) => {
    const jobId = req.params.id;

    try {
        const jobsResult = await JobServices.getJobById(jobId);

        if (jobsResult.success) {
            res.render('jobPage', { job: jobsResult.job })

        } else {
            res.render('erro', { errMsg: jobsResult.errMsg })
        }
    } catch (error) {
        console.error('Erro no getClientPage controller ' + error)
    }

}
const Job = require('../models/Job')
const JobServices = require('../services/JobServices');
const MaterialServices = require('../services/MaterialServices');
const PaymentServices = require('../services/PaymentServices');
const asyncHandler = require('../utils/asyncHandler');
const { formatarParaFloat, formatarValor } = require('../utils/formattingHelpers')


exports.addJob = asyncHandler(async (req, res) => {
    const valorTotal = formatarParaFloat(req.body.totalValue);


    const job = new Job({
        descr: req.body.descr,
        jobDate: req.body.date,
        totalValue: valorTotal,
        clientId: req.params.id,
        userId: req.session.user.id
    })

    await JobServices.addJob(job);
    res.redirect(`/client/${req.params.id}`)

})

exports.editJob = asyncHandler(async (req, res) => {
    let valorTotal;
    if (req.body.totalValue) {
        valorTotal = formatarParaFloat(req.body.totalValue);
    }
    const job = ({
        id: req.params.id,
        payed: req.body.payed,
        descr: req.body.descr,
        jobDate: req.body.date,
        totalValue: valorTotal,
    })

    await JobServices.editJob(job);
    res.redirect(`/job/${req.params.id}`)

})

exports.deleteJob = asyncHandler(async (req, res) => {

    await JobServices.deleteJob(req.params.id);
    res.redirect(req.session.returnTo)

})

exports.getJobPage = asyncHandler(async (req, res) => {

    const jobId = req.params.id;
    const jobsRes = await JobServices.getJobById(jobId);
    const materialsRes = await MaterialServices.getMaterialsByJob(jobId);
    const paymentsRes = await PaymentServices.getPaymentsByJob(jobId);


    let paymentsVal = paymentsRes.totalSum
    let materialsVal = materialsRes.totalSum
    let profit = formatarValor(paymentsVal - materialsVal);


    res.render('jobPage', {
        job: jobsRes.job,
        materials: materialsRes.materials, materialsVal: formatarValor(materialsVal),
        payments: paymentsRes.payments, paymentsVal: formatarValor(paymentsVal), profit

    })
})

exports.showJobList = asyncHandler(async (req, res) => {
    console.log('estou rodando')
    let page = Number(req.query.page);

    let params = {
        page: page,
        userId: req.session.user.id,
        search: req.query.search || null
    }


    const totalPages = await JobServices.getJobPages(params);
    const searchQuery = req.query.search ? `&search=${encodeURIComponent(req.query.search)}` : ''
    if (isNaN(page) || page < 1 || page > totalPages) {
        return res.redirect(`/jobs?page=1${searchQuery}`);
    }

    const jobsResult = await JobServices.getJobListByPage(params);

    console.log('cheguei no render')
    return res.render('jobsList', {
        jobs: jobsResult.jobs, totalPages,
        search: req.query.search, searchQuery, page: page
    })

})
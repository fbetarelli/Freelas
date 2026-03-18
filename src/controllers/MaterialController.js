const Material = require('../models/Material')
const MaterialServices = require('../services/MaterialServices');
const asyncHandler = require('../utils/asyncHandler');
const { formatarParaFloat } = require('../utils/formattingHelpers')

exports.addMaterial = asyncHandler(async (req, res) => {
    const valorUnitario = formatarParaFloat(req.body.unitaryVal)
    const material = new Material({
        supplier: req.body.supplier,
        descr: req.body.descr,
        qnt: req.body.qnt,
        unitaryVal: valorUnitario,
        jobId: req.params.id

    })

    await MaterialServices.addMaterial(material);

    res.redirect(`/job/${req.params.id}`)

})
exports.editMaterial = asyncHandler(async (req, res) => {

    let valorUnitario;
    if (req.body.unitaryVal) {
        valorUnitario = formatarParaFloat(req.body.unitaryVal)
    }

    const material = ({
        id: req.params.materialid,
        supplier: req.body.supplier,
        descr: req.body.descr,
        qnt: req.body.qnt,
        unitaryVal: valorUnitario,
    })

    await MaterialServices.editMaterial(material);
    res.redirect(`/job/${req.params.id}`)

})

exports.deleteMaterial = asyncHandler(async (req, res) => {
    await MaterialServices.deleteMaterial(req.params.materialid);
    res.redirect(`/job/${req.params.id}`)

})


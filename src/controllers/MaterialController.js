const Material = require('../models/Material')
const MaterialServices = require('../services/MaterialServices');

exports.addMaterial = async (req, res) => {
    console.log('rodou add material')
    try {
        //tira os pontos da string ex: 199,99
        const temp = req.body.unitaryVal.replace(/\./g, '')
        const valorUnitario = parseFloat(temp.replace(/,/g, '.'))



        const material = new Material({
            supplier: req.body.supplier,
            descr: req.body.descr,
            qnt: req.body.qnt,
            unitaryVal: valorUnitario,
            jobId: req.params.id

        })

        const result = await MaterialServices.addMaterial(material);
        if (result.success) {
            console.log('result success')
            res.redirect(`/job/${req.params.id}`)
        }
    } catch (error) {
        console.log('result erro')
        res.render('erro', { errMsg: error })
    }

}
exports.editMaterial = async (req, res) => {
    console.log('rodou')
    try {
        let valorUnitario;
        //tira os pontos da string ex: 199,99
        if (req.body.unitaryVal) {
            const temp = req.body.unitaryVal.replace(/\./g, '')
            valorUnitario = temp.replace(/,/g, '.')
        }


        const material = ({
            id: req.params.materialid,
            supplier: req.body.supplier,
            descr: req.body.descr,
            qnt: req.body.qnt,
            unitaryVal: valorUnitario,
        })

        const result = await MaterialServices.editMaterial(material);
        if (result.success) {

            res.redirect(`/job/${req.params.id}`)
        }
    } catch (error) {
        console.log('result erro')
        res.render('erro', { errMsg: error })
    }

}
exports.deleteMaterial = async (req, res) => {
    console.log('rodou')
    try {

        const result = await MaterialServices.deleteMaterial(req.params.materialid);
        if (result.success) {

            res.redirect(`/job/${req.params.id}`)
        }
    } catch (error) {
        console.log('result erro')
        res.render('erro', { errMsg: error })
    }

}


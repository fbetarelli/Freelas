const pool = require('../models/Database');
const Material = require('../models/Material');

class MaterialDAO {


    async addMaterial(material) {
        try {
            console.log('rodou add material dao')
            const query = `INSERT INTO materials(descr,supplier,qnt, unitaryVal,jobId) VALUES ($1,$2,$3,$4,$5)`
            const params = [material.getDescription(), material.getSupplier(), material.getQuantity(), material.getUnitaryValue(), material.getJobId()]
            console.log(query)
            console.log(params)


            const res = await pool.query(query, params);
            console.log('rodou add material dao query')

        } catch (error) {
            console.error('Erro no MaterialDAO addMaterials ' + error)
            throw error
        }

    }
    async editMaterial(material) {

        try {
            let fields = []
            let values = []
            let index = 1;

            Object.entries(material).forEach(([key, value]) => {
                if (value) {

                    fields.push(`${key} = $${index++}`)
                    values.push(value)
                }
            });
            values.push(material.id)

            const query = `UPDATE materials SET ${fields.join(', ')} WHERE id=$${index}`


            const res = await pool.query(query, values);


        } catch (error) {
            console.error('Erro no MaterialDAO editMaterials ' + error)
            throw error
        }

    }
    async deleteMaterial(materialid) {
        const query = `DELETE FROM materials WHERE id=$1`
        const params = [materialid]

        try {

            const res = await pool.query(query, params);


        } catch (error) {
            console.error('Erro no MaterialDAO addMaterials ' + error)
            throw error
        }

    }

    async getMaterialsByJob(jobId) {

        const query = `SELECT * FROM materials WHERE jobId=$1`
        const params = [jobId]

        try {
            const res = await pool.query(query, params);
            const materialsArray = [];
            if (res.rows.length > 0) {


                res.rows.forEach(obj => {
                    let material = new Material({
                        id: obj.id,
                        supplier: obj.supplier,
                        descr: obj.descr,
                        qnt: obj.qnt,
                        unitaryVal: obj.unitaryval,
                    })
                    materialsArray.push(material);

                });

            }
            return materialsArray;

        } catch (error) {
            console.error('Erro no MaterialDAO getMaterialsByJob ' + error)
            throw error
        }

    }
    async getTotalFromLastMonth(userId) {

        const query = `SELECT SUM(materials.unitaryVal*qnt)
FROM materials
JOIN jobs ON materials.jobId = jobs.id
WHERE jobs.userId = $1 AND jobs.jobDate >= CURRENT_DATE - INTERVAL '1 month'`
        const params = [userId]

        try {
            const res = await pool.query(query, params);
            if (res.rows.length > 0) {
                return res.rows[0].sum
            }
            return 0;

        } catch (error) {
            console.error('Erro no MaterialDAO getTotalFromLastMonth ' + error)
            throw error
        }

    }



}


module.exports = MaterialDAO;
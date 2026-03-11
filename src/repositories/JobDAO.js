const pool = require('../models/Database');
const Job = require('../models/Job');


class JobDAO {


    async getJobsByClient(clientId) {
        const query = `SELECT * FROM jobs WHERE clientId=$1`
        const params = [clientId]

        try {
            const res = await pool.query(query, params);
            const jobsArray = [];
            if (res.rows.length > 0) {


                res.rows.forEach(obj => {
                    let job = new Job({
                        id: obj.id,
                        jobDate: obj.jobDate,
                        descr: obj.descr,
                        payed: obj.payed,
                        totalValue: obj.totalValue,
                    })
                    jobsArray.push(job);

                });
                return jobsArray;
            } else {
                return jobsArray;
            }
        } catch (error) {
            console.error('Erro no JobDAO getJobsByClient ' + error)
            throw error
        }

    }



}


module.exports = JobDAO;
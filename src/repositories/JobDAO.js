const pool = require('../models/Database');
const Job = require('../models/Job');


class JobDAO {


    async addJob(job) {
        console.log('rodando dao')
        const query = `INSERT INTO jobs(descr,jobDate,totalValue,clientId,userId) VALUES ($1,$2,$3,$4,$5)`
        const params = [job.getDescription(), job.getJobDate(), job.getTotalValue(), job.getClientId(), job.getUserId()]

        try {

            const res = await pool.query(query, params);
            console.log('fim dao')

        } catch (error) {
            console.error('Erro no JobDAO getJobsByClient ' + error)
            throw error
        }

    }
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
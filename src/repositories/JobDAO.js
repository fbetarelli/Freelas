const pool = require('../models/Database');
const Job = require('../models/Job');


class JobDAO {


    async addJob(job) {
        const query = `INSERT INTO jobs(descr,jobDate,totalValue,clientId,userId) VALUES ($1,$2,$3,$4,$5)`
        const params = [job.getDescription(), job.getJobDate(), job.getTotalValue(), job.getClientId(), job.getUserId()]

        try {

            const res = await pool.query(query, params);


        } catch (error) {
            console.error('Erro no JobDAO addJobs ' + error)
            throw error
        }

    }
    async editJob(job) {

        try {
            let fields = []
            let values = []
            let index = 1;

            Object.entries(job).forEach(([key, value]) => {

                if (value || key === 'payed') {

                    fields.push(`${key} = $${index++}`)
                    values.push(value)
                }
            });
            values.push(job.id)

            const query = `UPDATE jobs SET ${fields.join(', ')} WHERE id=$${index}`


            const res = await pool.query(query, values);


        } catch (error) {
            console.error('Erro no JobDAO addJobs ' + error)
            throw error
        }

    }
    async deleteJob(jobid) {
        const query = `DELETE FROM jobs WHERE id=$1`
        const params = [jobid]

        try {

            const res = await pool.query(query, params);


        } catch (error) {
            console.error('Erro no JobDAO addJobs ' + error)
            throw error
        }

    }
    async getJobById(id) {
        const query = `SELECT * FROM jobs WHERE id=$1`
        const params = [id]

        try {

            const res = await pool.query(query, params);
            if (res.rows.length > 0) {
                let job = new Job({
                    clientId: res.rows[0].clientid,
                    userId: res.rows[0].userid,
                    id: res.rows[0].id,
                    payed: res.rows[0].payed,
                    jobDate: res.rows[0].jobdate,
                    descr: res.rows[0].descr,
                    totalValue: res.rows[0].totalvalue,
                })
                return job
            }
            return null


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
                        jobDate: obj.jobdate,
                        descr: obj.descr,
                        payed: obj.payed,
                        totalValue: obj.totalvalue,
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
    async getLastJobsByUser(userId) {
        const query = `SELECT * FROM jobs WHERE userId=$1 ORDER BY jobDate DESC LIMIT 5 `
        const params = [userId]

        try {
            const res = await pool.query(query, params);
            const jobsArray = [];
            if (res.rows.length > 0) {


                res.rows.forEach(obj => {
                    let job = new Job({
                        id: obj.id,
                        jobDate: obj.jobdate,
                        descr: obj.descr,
                        payed: obj.payed,
                        totalValue: obj.totalvalue,
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
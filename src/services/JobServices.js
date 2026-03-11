const Job = require('../models/Job');
const JobDAO = require('../repositories/JobDAO');

exports.getJobsByClient = async (clientId) => {
    let dao = new JobDAO;
    try {
        const jobsArray = await dao.getJobsByClient(clientId)
        return { success: true, jobsArray }


    } catch (error) {

        return { success: false, errMsg: error };
    }
}
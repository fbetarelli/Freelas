const Job = require('../models/Job');
const JobDAO = require('../repositories/JobDAO');

exports.getJobsByClient = async (clientId) => {
    let dao = new JobDAO;
    try {
        const jobsArray = await dao.getJobsByClient(clientId)
        if (jobsArray && jobsArray.length > 0) {

            return { success: true, jobsArray }
        } else {

            return { success: false, errMsg: 'Nenhum serviço encontrado.' }
        }

    } catch (error) {

        return { success: false, errMsg: error };
    }
}
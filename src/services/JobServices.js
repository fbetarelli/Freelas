const JobDAO = require('../repositories/JobDAO');
const { runDAO } = require('../utils/serviceHelper');
const { toDTO } = require('../mappers/JobMapper');

const dao = new JobDAO;

exports.addJob = async (job) => {
    return runDAO(dao, "addJob", job);
}
exports.editJob = async (job) => {
    return runDAO(dao, "editJob", job);
}
exports.deleteJob = async (jobId) => {
    return runDAO(dao, "deleteJob", jobId);
}

exports.getJobById = async (id) => {
    return runDAO(dao, "getJobById", id, toDTO, "job");
}

exports.getJobsByClient = async (clientId) => {
    return runDAO(dao, "getJobsByClient", clientId, toDTO, "jobsArray");
}

exports.getLastJobsByUser = async (userId) => {
    return runDAO(dao, "getLastJobsByUser", userId, toDTO, "jobs");
}


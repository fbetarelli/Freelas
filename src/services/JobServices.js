const JobDTO = require('../DTO/JobDTO');
const Job = require('../models/Job');
const JobDAO = require('../repositories/JobDAO');
const { runDAO } = require('../utils/serviceHelper');
const { formatarData, formatarValor } = require('../utils/formattingHelpers');

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
    let dao = new JobDAO;
    try {
        const job = await dao.getJobById(id);
        let dto = toDTO(job)
        return { success: true, job: dto }
    } catch (error) {

        return { success: false, errMsg: error };
    }
}

exports.getJobsByClient = async (clientId) => {
    let dao = new JobDAO;
    try {
        const result = await dao.getJobsByClient(clientId)
        const DTOArray = []

        if (result && result.length > 0) {
            result.forEach(entity => {
                let dto = toDTO(entity)
                DTOArray.push(dto)
            })
        }
        return { success: true, jobsArray: DTOArray }

    } catch (error) {

        return { success: false, errMsg: error };
    }
}
exports.getLastJobsByUser = async (userId) => {
    let dao = new JobDAO;
    try {
        const result = await dao.getLastJobsByUser(userId)
        const DTOArray = []

        if (result && result.length > 0) {
            result.forEach(entity => {
                let dto = toDTO(entity)
                DTOArray.push(dto)
            })
        }
        return { success: true, jobs: DTOArray }

    } catch (error) {

        return { success: false, errMsg: error };
    }
}

function toDTO(obj) {
    let dto = new JobDTO({
        id: obj.getId(),
        clientId: obj.getClientId(),
        jobDate: formatarData(obj.getJobDate()),
        descr: obj.getDescription(),
        payed: (obj.isPayed() ? 'Serviço pago' : 'Aguardando pagamento'),
        totalValue: formatarValor(obj.getTotalValue())
    })
    return dto
}
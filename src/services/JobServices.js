const JobDTO = require('../DTO/JobDTO');
const Job = require('../models/Job');
const JobDAO = require('../repositories/JobDAO');

exports.addJob = async (job) => {
    let dao = new JobDAO;
    try {
        await dao.addJob(job);
        return { success: true }


    } catch (error) {

        return { success: false, errMsg: error };
    }
}
exports.getJobById = async (id) => {
    let dao = new JobDAO;
    try {
        const job = await dao.getJobById(id);
        let dto = new JobDTO({
            clientId: job.getClientId(),
            id: job.getId(),
            jobDate: formatarData(job.getJobDate()),
            descr: job.getDescription(),
            payed: job.isPayed(),
            totalValue: job.getTotalValue()
        })
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

                let dto = new JobDTO({
                    id: entity.getId(),
                    jobDate: formatarData(entity.getJobDate()),
                    descr: entity.getDescription(),
                    payed: entity.isPayed(),
                    totalValue: entity.getTotalValue()
                })
                DTOArray.push(dto)
            })
        }
        return { success: true, jobsArray: DTOArray }

    } catch (error) {

        return { success: false, errMsg: error };
    }
}

function formatarData(data) {
    const dateFromDB = new Date(data);

    // Formatar para PT-BR (12/03/2026)
    const formattedDate = dateFromDB.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
    return formattedDate;
}
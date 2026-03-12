const JobDTO = require('../DTO/JobDTO');
const Job = require('../models/Job');
const JobDAO = require('../repositories/JobDAO');

exports.addJob = async (job) => {
    let dao = new JobDAO;
    console.log('rodando add job')
    try {
        await dao.addJob(job);
        console.log('rodou dao')
        return { success: true }


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
                    jobDate: entity.getJobDate(),
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
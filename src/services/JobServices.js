const JobDTO = require('../DTO/JobDTO');
const Job = require('../models/Job');
const JobDAO = require('../repositories/JobDAO');

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
                    descr: entity.getDescr(),
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
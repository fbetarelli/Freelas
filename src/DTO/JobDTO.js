class JobDTO {
    id
    jobDate
    descr
    payed
    totalValue
    clientId
    userId

    constructor({ clientId, id, jobDate, descr, payed, totalValue }) {
        this.clientId = clientId
        this.id = id
        this.jobDate = jobDate
        this.descr = descr
        this.payed = payed
        this.totalValue = totalValue
    }
}

module.exports = JobDTO
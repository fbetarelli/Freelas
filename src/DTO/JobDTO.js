class JobDTO {
    id
    jobDate
    descr
    payed
    totalValue
    clientId
    userId

    constructor({ id, jobDate, descr, payed, totalValue }) {
        this.id = id
        this.jobDate = jobDate
        this.descr = descr
        this.payed = payed
        this.totalValue = totalValue
    }
}

module.exports = JobDTO
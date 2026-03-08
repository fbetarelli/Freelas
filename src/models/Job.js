class Job {
    #id
    #jobDate
    #descr
    #payed
    #totalValue
    #clientId
    #userId

    constructor({ id, jobDate, descr, payed, totalValue, clientId, userId }) {
        this.#id = id
        this.#jobDate = jobDate
        this.#descr = descr
        this.#payed = payed
        this.#totalValue = totalValue
        this.#clientId = clientId
        this.#userId = userId
    }

    getId() { return this.#id }

    getDate() { return this.#jobDate }

    getDescription() { return this.#descr }

    getTotalValue() { return this.#totalValue }

    isPayed() { return this.#payed }

    getClientId() { return this.#clientId }

    getUserId() { return this.#userId }
}

module.exports = Job;
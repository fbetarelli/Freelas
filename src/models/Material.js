class Material {
    #id
    #descr
    #supplier
    #qnt
    #unitaryVal
    #jobId

    constructor({ id, descr, supplier, qnt, unitaryVal, jobId }) {
        this.#id = id
        this.#descr = descr
        this.#supplier = supplier
        this.#qnt = qnt
        this.#unitaryVal = unitaryVal
        this.#jobId = jobId
    }

    getId() { return this.#id }

    getDescription() { return this.#descr }

    getSupplier() { return this.#supplier }

    getQuantity() { return this.#qnt }

    getUnitaryValue() { return this.#unitaryVal }

    getJobId() { return this.#jobId }

    getSubtotal() {
        return this.#qnt * this.#unitaryVal
    }


}

module.exports = Material;
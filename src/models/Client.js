class Client {
    #id
    #name
    #address
    #contact
    #userId
    #last_service_at

    constructor({ id, name, address, contact, last_service_at, userId }) {
        this.#id = id;
        this.#name = name;
        this.#address = address;
        this.#contact = contact;
        this.#last_service_at = last_service_at;
        this.#userId = userId;
    }

    getId() {
        return this.#id
    }

    getName() {
        return this.#name
    }

    getAddress() {
        return this.#address
    }

    getContact() {
        return this.#contact
    }

    getUserId() {
        return this.#userId
    }
    LastServiceAt() {
        return this.#userId
    }

    toJSON() {
        return {
            id: this.#id,
            name: this.#name,
            contact: this.#contact,
            address: this.#address,
            userId: this.#userId
        }
    }

}

module.exports = Client;
class Client {
    #id
    #name
    #address
    #contact
    #userId

    constructor({ id, name, address, contact, userId }) {
        this.#id = id;
        this.#name = name;
        this.#address = address;
        this.#contact = contact;
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
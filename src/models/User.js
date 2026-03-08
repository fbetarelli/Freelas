class User {
    #id
    #login
    #hashPassword

    constructor({ id, login, hash }) {
        this.#id = id;
        this.#login = login;
        this.#hashPassword = hash;
    }

    getId() { return this.#id }

    getLogin() { return this.#login }

    gethashPassword() { return this.#hashPassword }


}

module.exports = User;
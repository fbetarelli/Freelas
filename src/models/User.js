class User {
    #id
    #login
    #hashPassword

    constructor({ id, login, hashPassword }) {
        this.#id = id;
        this.#login = login;
        this.#hashPassword = hashPassword;
    }

    getId() { return this.#id }

    getLogin() { return this.#login }

    gethashPassword() { return this.#hashPassword }


}

module.exports = User;
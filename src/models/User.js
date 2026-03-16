class User {
    #id
    #username
    #login
    #hashPassword

    constructor({ id, username, login, hashPassword }) {
        this.#id = id;
        this.#username = username;
        this.#login = login;
        this.#hashPassword = hashPassword;
    }

    getId() { return this.#id }

    getUsername() { return this.#username }

    getLogin() { return this.#login }

    gethashPassword() { return this.#hashPassword }


}

module.exports = User;
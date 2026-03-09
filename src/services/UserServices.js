const User = require('../models/User')
const UserDAO = require('../repositories/UserDAO')
const bcrypt = require('bcrypt');

exports.login = async (login, password) => {
    try {
        let dao = new UserDAO;

        let user = await dao.findByLogin(login)
        if (user) {
            console.log(user.gethashPassword())
            let validate = await bcrypt.compare(password, user.gethashPassword())
            if (validate) {
                return { success: true, user }
            }
        }
        return { success: false, errMsg: 'login não encontrado!' }

    } catch (error) {
        return { success: false, errMsg: error }
    }

}
exports.register = async (login, password) => {
    try {
        let dao = new UserDAO;
        let check = await dao.findByLogin(login)

        if (check) {
            return { success: false, errMsg: 'Esse login já existe!' }
        }

        let saltRounds = 10;
        let hash = await bcrypt.hash(password, saltRounds)

        let user = await dao.register(login, hash)
        return { success: true, user }

    } catch (error) {
        return { success: false, errMsg: error }
    }

}
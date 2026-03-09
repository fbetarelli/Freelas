const User = require('../models/User')
const UserDAO = require('../repositories/UserDAO')
const bcrypt = require('bcrypt');

exports.register = async (login, password) => {
    try {

        let dao = new UserDAO;

        let check = await dao.loginExists(login)
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
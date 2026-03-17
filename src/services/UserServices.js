const User = require('../models/User')
const UserDAO = require('../repositories/UserDAO')
const PaymentDAO = require('../repositories/PaymentDAO')
const MaterialDAO = require('../repositories/MaterialDAO')
const { formatarValor } = require('../utils/formattingHelpers');
const bcrypt = require('bcrypt');

exports.login = async (login, password) => {
    try {
        let dao = new UserDAO;

        let user = await dao.findByLogin(login)
        if (user) {
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
exports.register = async (username, login, password) => {
    try {
        let dao = new UserDAO;
        let check = await dao.findByLogin(login)

        if (check) {
            return { success: false, errMsg: 'Esse login já existe!' }
        }

        let saltRounds = 10;
        let hash = await bcrypt.hash(password, saltRounds)

        let user = await dao.register(username, login, hash)
        return { success: true, user }

    } catch (error) {
        return { success: false, errMsg: error }
    }

}
exports.getProfitFromLastMonth = async (userid) => {
    try {
        let paymentDao = new PaymentDAO
        let materialDao = new MaterialDAO

        let paymentTotal = await paymentDao.getTotalFromLastMonth(userid)
        let materialTotal = await materialDao.getTotalFromLastMonth(userid)

        const final = (paymentTotal - materialTotal)
        return { success: true, profit: formatarValor(final) }

    } catch (error) {
        return { success: false, errMsg: error }
    }


}

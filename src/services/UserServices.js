const UserDAO = require('../repositories/UserDAO')
const PaymentDAO = require('../repositories/PaymentDAO')
const MaterialDAO = require('../repositories/MaterialDAO')
const { formatarValor } = require('../utils/formattingHelpers');
const bcrypt = require('bcrypt');

exports.login = async (login, password) => {

    let dao = new UserDAO;

    let user = await dao.findByLogin(login)
    if (user) {
        let validate = await bcrypt.compare(password, user.gethashPassword())
        if (validate) {
            return { user }
        }
    }
    return { user: null }
}
exports.register = async (username, login, password) => {

    let dao = new UserDAO;
    let check = await dao.findByLogin(login)

    if (check) {
        return { success: false, errMsg: 'Esse login já existe!' }
    }

    let saltRounds = 10;
    let hash = await bcrypt.hash(password, saltRounds)

    let user = await dao.register(username, login, hash)
    return { user }



}
exports.getProfitFromLastMonth = async (userid) => {
    let paymentDao = new PaymentDAO
    let materialDao = new MaterialDAO

    let paymentTotal = await paymentDao.getTotalFromLastMonth(userid)
    let materialTotal = await materialDao.getTotalFromLastMonth(userid)

    const final = (paymentTotal - materialTotal)
    return { profit: formatarValor(final) }
}

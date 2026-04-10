const UserDAO = require('../repositories/UserDAO')
const JobDAO = require('../repositories/JobDAO')
const PaymentDAO = require('../repositories/PaymentDAO')
const MaterialDAO = require('../repositories/MaterialDAO')
const { formatarValor } = require('../utils/formattingHelpers');
const bcrypt = require('bcrypt');
const { runDAO } = require('../utils/serviceHelper');

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
        const err = new Error()
        err.customMessage = 'Cadastro Existente';
        err.code = 409;
        return { err }
    }

    let saltRounds = 10;
    let hash = await bcrypt.hash(password, saltRounds)

    let user = await dao.register(username, login, hash)
    return { user }



}

exports.editUser = async (id, username, login, password) => {
    let hash = null;
    saltRounds = 10;
    if (password) {
        hash = await bcrypt.hash(password, saltRounds);
    }

    const user = ({
        id: id,
        username: username,
        login: login,
        hashPassword: hash || password,
    })

    let dao = new UserDAO;
    let res = await dao.editUser(user);

    return res

}
exports.getProfitFromLastMonth = async (userid) => {
    let paymentDao = new PaymentDAO
    let materialDao = new MaterialDAO

    let paymentTotal = await paymentDao.getTotalFromLastMonth(userid)
    let materialTotal = await materialDao.getTotalFromLastMonth(userid)

    const final = (paymentTotal - materialTotal)
    return { profit: formatarValor(final) }
}

exports.getJobCount = async (userid) => {
    let dao = new JobDAO

    let jobcount = await dao.getJobCount(userid)

    return jobcount;
}

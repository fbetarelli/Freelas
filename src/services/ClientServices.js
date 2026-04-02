const ClientDAO = require('../repositories/ClientDAO');
const { runDAO } = require('../utils/serviceHelper');
const { toDTO } = require('../mappers/ClientMapper')

const dao = new ClientDAO

exports.addClient = (client) => {
    return runDAO(dao, "addClient", client);
}
exports.editClient = async (client) => {
    return runDAO(dao, "editClient", client);
}
exports.deleteClient = async (clientId) => {
    return runDAO(dao, "deleteClient", clientId);
}

exports.getLatestClients = async (userId) => {
    return runDAO(dao, "getLatestClients", userId, toDTO, "clients")
}
exports.getClientListByPage = async (params) => {
    params.page -= 1
    params.page *= 10
    return runDAO(dao, "getClientListByPage", params, toDTO, "clients")
}

exports.getClientById = async (id) => {
    return runDAO(dao, "getClientById", id, toDTO, "client")
}

exports.getClientPages = async (params) => {
    let total = await dao.getClientCount(params)

    return Math.max(1, Math.ceil(total / 10));

}


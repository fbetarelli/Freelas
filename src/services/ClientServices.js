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

exports.getClients = async (userId) => {
    return runDAO(dao, "getClients", userId, toDTO, "clients")
}

exports.getClientById = async (id) => {
    return runDAO(dao, "getClientById", id, toDTO, "client")
}



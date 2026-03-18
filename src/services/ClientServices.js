const Client = require('../models/Client');
const ClientDAO = require('../repositories/ClientDAO');
const ClientDTO = require('../DTO/ClientDTO');
const { runDAO } = require('../utils/serviceHelper');



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
    try {
        const result = await dao.getClients(userId)
        const DTOArray = []

        if (result && result.length > 0) {
            result.forEach(entity => {
                let dto = toDTO(entity)
                DTOArray.push(dto)
            })
        }
        return { success: true, clients: DTOArray }
    } catch (error) {

        return { success: false, errMsg: error };
    }
}

exports.getClientById = async (id) => {
    let dao = new ClientDAO;
    try {
        const client = await dao.getClientById(id);
        let dto = toDTO(client)
        return { success: true, client: dto };

    } catch (error) {
        return { success: false, errMsg: error };
    }
}

function toDTO(obj) {
    let dto = new ClientDTO({
        id: obj.getId(),
        name: obj.getName(),
        address: obj.getAddress(),
        contact: obj.getContact()

    })
    return dto;
}


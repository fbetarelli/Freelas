const Client = require('../models/Client');
const ClientDAO = require('../repositories/ClientDAO');
const ClientDTO = require('../DTO/ClientDTO');

exports.addClient = async (client) => {
    let dao = new ClientDAO
    try {
        await dao.addClient(client);
        return { success: true };

    } catch (error) {
        return { success: false, errMsg: error };
    }
}
exports.editClient = async (client) => {
    let dao = new ClientDAO

    try {
        await dao.editClient(client);
        return { success: true };

    } catch (error) {
        return { success: false, errMsg: error };
    }
}
exports.deleteClient = async (clientId) => {
    let dao = new ClientDAO

    try {
        await dao.deleteClient(clientId);
        return { success: true };

    } catch (error) {
        return { success: false, errMsg: error };
    }
}

exports.getClients = async (userId) => {
    let dao = new ClientDAO;
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
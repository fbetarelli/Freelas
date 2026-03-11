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
                let dto = new ClientDTO({
                    id: entity.getId(),
                    name: entity.getName(),
                    address: entity.getAddress(),
                    contact: entity.getContact()
                })
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
        let dto = new ClientDTO({
            id: client.getId(),
            name: client.getName(),
            address: client.getAddress(),
            contact: client.getContact()
        })
        return { success: true, client: dto };

    } catch (error) {
        return { success: false, errMsg: error };
    }
} 
const Client = require('../models/Client');
const ClientDAO = require('../repositories/ClientDAO');

exports.addClient = async (client) => {
    let dao = new ClientDAO
    try {
        await dao.addClient(client);
        return { success: true };

    } catch (error) {
        return { success: false, errMsg: error };
    }
}

exports.getClients = async (userId) => {
    let dao = new ClientDAO;
    try {
        const clientsArray = await dao.getClients(userId)
        if (clientsArray && clientsArray.length > 0) {

            return { success: true, clientsArray }
        } else {

            return { success: false, errMsg: 'Nenhum cliente encontrado' }
        }

    } catch (error) {

        return { success: false, errMsg: error };
    }
}
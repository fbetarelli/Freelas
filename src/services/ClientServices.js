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
const pool = require('../models/Database');
const Client = require('../models/Client');


class ClientDAO {
    async addClient(client) {
        const query = `INSERT INTO clients(name,address,contact,userID) VALUES ($1,$2,$3,$4) RETURNING 1`
        const params = [client.getName(), client.getAddress(), client.getContact(), client.getUserId()]

        try {
            const res = await pool.query(query, params);

            if (res.rows.length > 0) {
                return true
            } else {
                return false
            }
        } catch (error) {
            console.error('Erro no ClienteDAO addClient ' + error)
            throw error
        }

    }
    async getClients(userId) {
        const query = `SELECT * FROM clients WHERE userId=$1`
        const params = [userId]

        try {
            const res = await pool.query(query, params);

            if (res.rows.length > 0) {
                const clientsArray = [];

                res.rows.forEach(obj => {
                    let client = new Client({
                        id: obj.id,
                        name: obj.name,
                        address: obj.address,
                        contact: obj.contact,
                        userId: obj.userid
                    })
                    console.log(client.getId())
                    console.log(clientsArray)
                    clientsArray.push(client);

                });
                return clientsArray;
            } else {
                return null
            }
        } catch (error) {
            console.error('Erro no ClienteDAO getClients ' + error)
            throw error
        }

    }


}


module.exports = ClientDAO;
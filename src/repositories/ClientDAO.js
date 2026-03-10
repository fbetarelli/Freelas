const pool = require('../models/Database');


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


}


module.exports = ClientDAO;
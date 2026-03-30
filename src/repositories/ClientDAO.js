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
    async deleteClient(clientId) {
        const query = `DELETE FROM clients WHERE id=$1`
        const params = [clientId]

        try {
            const res = await pool.query(query, params);

        } catch (error) {
            console.error('Erro no ClienteDAO deleteClient ' + error)
            throw error
        }

    }
    async editClient(client) {

        const fields = [];
        const values = [];
        let index = 1

        //Object entries: separa objeto em dois atributos: chave e valor;
        Object.entries(client).forEach(([key, value]) => {
            console.log(key, value);
            if (value) {
                //cria fields dinamicamente, EX: key=name, index=1, field gerado: name = $1;
                fields.push(`${key} = $${index++}`);
                values.push(value);
            }


        });
        values.push(client.id)
        const query = `UPDATE clients SET ${fields.join(', ')} WHERE id=$${index}`

        try {
            const res = await pool.query(query, values);
        } catch (error) {

            console.error('Erro no ClienteDAO addClient ' + error)
            throw error
        }

    }
    async getLatestClients(userId) {
        const query = `
                        SELECT * FROM clients LEFT JOIN (SELECT clientId, MAX(jobDate) AS lastJobDate
                        FROM jobs
                        GROUP BY clientId) AS latest_jobs ON clients.id = latest_jobs.clientid WHERE clients.userId = $1 ORDER BY  latest_jobs.lastJobDate DESC NULLS LAST
                        `
        const params = [userId]
        console.log(userId)

        try {
            const res = await pool.query(query, params);
            const clientsArray = [];

            if (res.rows.length > 0) {



                res.rows.forEach(obj => {
                    let client = new Client({
                        id: obj.id,
                        name: obj.name,
                        address: obj.address,
                        contact: obj.contact,
                        userId: obj.userid
                    })
                    clientsArray.push(client);

                });
                return clientsArray;
            } else {
                return clientsArray;
            }
        } catch (error) {
            console.error('Erro no ClienteDAO getLatestClients ' + error)
            throw error
        }

    }
    async getClientById(clientId) {
        const query = `SELECT * FROM clients WHERE id=$1`
        const params = [clientId]

        try {
            const res = await pool.query(query, params);

            if (res.rows.length > 0) {


                let client = new Client({
                    id: res.rows[0].id,
                    name: res.rows[0].name,
                    address: res.rows[0].address,
                    contact: res.rows[0].contact,
                    userId: res.rows[0].userid
                })

                return client;
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
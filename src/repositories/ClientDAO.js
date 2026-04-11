const pool = require('../models/Database');
const Client = require('../models/Client');


class ClientDAO {
    async addClient(client) {
        const query = `INSERT INTO clients(name,address,contact,userID) VALUES ($1,$2,$3,$4) RETURNING 1`
        const params = [client.getName(), client.getAddress(), client.getContact(), client.getUserId()]

        try {
            await pool.query(query, params);
        } catch (error) {
            console.error('Erro no ClienteDAO addClient ' + error)
            throw error
        }

    }
    async deleteClient(clientId) {
        const query = `DELETE FROM clients WHERE id=$1`
        const params = [clientId]

        try {
            await pool.query(query, params)
        }
        catch (error) {
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
            if (value) {
                //cria fields dinamicamente, EX: key=name, index=1, field gerado: name = $1;
                fields.push(`${key} = $${index++}`);
                values.push(value);
            }
        });

        values.push(client.id)
        const query = `UPDATE clients SET ${fields.join(', ')} WHERE id=$${index}`

        try {
            await pool.query(query, values);
        } catch (error) {
            console.error('Erro no ClienteDAO editClient ' + error)
            throw error
        }

    }
    async getLatestClients(userId) {
        const query = `
                        SELECT * FROM clients LEFT JOIN (SELECT clientId, MAX(jobDate) AS lastJobDate
                        FROM jobs
                        GROUP BY clientId) AS latest_jobs ON clients.id = latest_jobs.clientid WHERE clients.userId = $1 ORDER BY  latest_jobs.lastJobDate DESC NULLS FIRST LIMIT 5
                        `
        const params = [userId]

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
            }
            return clientsArray;

        } catch (error) {
            console.error('Erro no ClienteDAO getLatestClients ' + error)
            throw error
        }

    }
    async getClientListByPage(obj) {
        const searchValue = obj.search ? `%${obj.search}%` : null;
        const query = `
                        SELECT * FROM clients LEFT JOIN (SELECT clientId, MAX(jobDate) AS lastJobDate
                        FROM jobs
                        GROUP BY clientId) AS latest_jobs ON clients.id = latest_jobs.clientid WHERE clients.userId = $1 AND (unaccent(name) ILIKE unaccent($2) OR $2 IS NULL) ORDER BY  latest_jobs.lastJobDate DESC NULLS FIRST LIMIT 10 OFFSET $3
                        `
        const params = [obj.userId, searchValue, obj.page]


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
            }
            return clientsArray;

        } catch (error) {
            console.error('Erro no ClienteDAO getClientListByPage ' + error)
            throw error
        }

    }
    async getClientCount(obj) {
        const searchValue = obj.search ? `%${obj.search}%` : null;
        const query = `
                       SELECT COUNT(*) AS count_cols FROM clients WHERE userId = $1 AND (unaccent(name) ILIKE unaccent($2) OR $2 IS NULL)    
             `
        const params = [obj.userId, searchValue]


        try {
            const res = await pool.query(query, params);
            return Number(res.rows[0].count_cols);

        } catch (error) {
            console.error('Erro no ClienteDAO getClientCount ' + error)
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
            }
            return null

        } catch (error) {
            console.error('Erro no ClienteDAO getClientById ' + error)
            throw error
        }

    }
}


module.exports = ClientDAO;
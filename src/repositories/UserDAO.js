const pool = require('../models/Database');
const User = require('../models/User');

class UserDAO {

    async register(login, hash) {
        try {

            const query = `INSERT INTO users(login,hashpassword) VALUES($1,$2) RETURNING id, login, hashpassword `;
            const params = [login, hash];
            const res = await pool.query(query, params);

            let user = new User({
                id: res.rows[0].id,
                login: res.rows[0].login,
            });

            return user

        } catch (error) {
            console.error('Erro no UserDAO register' + error);
            throw error
        }
    }

    async findByLogin(login) {
        try {
            const query = `SELECT * FROM users WHERE login=$1 LIMIT 1`
            const params = [login]

            const res = await pool.query(query, params);

            if (res.rows.length > 0) {
                let user = new User({
                    id: res.rows[0].id,
                    login: res.rows[0].login,
                    hashPassword: res.rows[0].hashpassword
                });
                return user
            }

            return null

        } catch (error) {
            console.error('Erro no UserDAO loginExiste' + error);
            throw error
        }


    }
}


module.exports = UserDAO
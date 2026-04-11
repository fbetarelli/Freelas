const pool = require('../models/Database');
const User = require('../models/User');

class UserDAO {

    async register(username, login, hash) {
        try {

            const query = `INSERT INTO users(username,login,hashpassword) VALUES($1,$2,$3) RETURNING id, username, login, hashpassword `;
            const params = [username, login, hash];
            const res = await pool.query(query, params);

            let user = new User({
                id: res.rows[0].id,
                username: res.rows[0].username,
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
                    username: res.rows[0].username,
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
    async editUser(user) {

        try {
            let fields = []
            let values = []
            let index = 1;

            Object.entries(user).forEach(([key, value]) => {
                if (value) {

                    fields.push(`${key} = $${index++}`)
                    values.push(value)
                }
            });
            values.push(user.id)

            const query = `UPDATE users SET ${fields.join(', ')} WHERE id=$${index} RETURNING id, username, login `
            const res = await pool.query(query, values);


            if (res.rows.length > 0) {
                let user = new User({
                    id: res.rows[0].id,
                    username: res.rows[0].username,
                    login: res.rows[0].login,
                });
                return user
            }

            return null


        } catch (error) {
            console.error('Erro no userDAO editUsers ' + error)
            throw error
        }

    }
}


module.exports = UserDAO
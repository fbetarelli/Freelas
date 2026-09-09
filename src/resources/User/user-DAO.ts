//@ts-nocheck
import { pool } from "../../database/Database.ts";
import { User, type UserType } from "./types.ts";

export class UserDAO {
  async register({ username, login, hashPassword }: Omit<UserType, "id">) {
    try {
      const query = `INSERT INTO users(username,login,hashpassword) VALUES($1,$2,$3) RETURNING id, username, login, hashpassword `;
      const params = [username, login, hashPassword];
      const res = await pool.query<User>(query, params);

      let user = new User({
        id: res.rows[0].id,
        username: res.rows[0].username,
        login: res.rows[0].login,
      });

      return user;
    } catch (error) {
      console.error("Erro no UserDAO register" + error);
      throw error;
    }
  }

  async findByLogin(login: string) {
    try {
      const query = `SELECT * FROM users WHERE login=$1 LIMIT 1`;
      const params = [login];

      const res = await pool.query<UserType>(query, params);

      if (res.rows.length > 0) {
        let user = new User({
          id: res.rows[0].id,
          username: res.rows[0].username,
          login: res.rows[0].login,
          //Caps
          hashPassword: res.rows[0].hashpassword,
        });
        return user;
      }

      return null;
    } catch (error) {
      console.error("Erro no UserDAO loginExiste" + error);
      throw error;
    }
  }
  async editUser(user: UserType) {
    try {
      let fields: string[] = [];
      let values: string[] = [];
      let index = 1;

      Object.entries(user).forEach(([key, value]) => {
        if (value) {
          fields.push(`${key} = $${index++}`);
          values.push(value);
        }
      });
      values.push(user.id);

      const query = `UPDATE users SET ${fields.join(", ")} WHERE id=$${index} RETURNING id, username, login `;
      const res = await pool.query<UserType>(query, values);

      if (res.rows.length > 0) {
        let user = new User({
          id: res.rows[0].id,
          username: res.rows[0].username,
          login: res.rows[0].login,
        });
        return user;
      }

      return null;
    } catch (error) {
      console.error("Erro no userDAO editUsers " + error);
      throw error;
    }
  }
}

import { pool } from "../../database/database.ts";
import { dynamicFieldsBuilder } from "../../utils/dynamic-fields-builder.ts";
import { errorLog } from "../../utils/error-log.ts";
import { type SessionUser, type User } from "./types.ts";

interface UserQueryResult extends Omit<User, "hashPassword"> {
  hashpassword: string;
}

export class UserDAO {
  async register({
    username,
    login,
    hashPassword: incomingHash,
  }: Omit<User, "id">): Promise<SessionUser> {
    try {
      const query = daoQueries.register;
      const params = [username, login, incomingHash];

      const res = await pool.query<UserQueryResult>(query, params);

      // eslint-disable-next-line
      const { hashpassword, ...user } = res.rows[0];

      return user;
    } catch (error) {
      errorLog("UserDAO", "register");
      throw error;
    }
  }

  async findByLogin(login: string): Promise<User | null> {
    try {
      const query = daoQueries.findByLogin;
      const params = [login];

      const res = await pool.query<UserQueryResult>(query, params);

      if (res.rows.length === 0) {
        return null;
      }

      const { hashpassword: hashPassword, ...rest } = res.rows[0];
      const user: User = {
        ...rest,
        hashPassword,
      };

      return user;
    } catch (error) {
      errorLog("UserDAO", "findByLogin");
      throw error;
    }
  }
  async editUser(
    userData: Partial<User> & { id: string },
  ): Promise<SessionUser | null> {
    try {
      const { fields, values, index } = dynamicFieldsBuilder(userData);
      values.push(userData.id);

      const query = daoQueries.editUser(fields, index);
      const res = await pool.query<Omit<UserQueryResult, "hashpassword">>(
        query,
        values,
      );

      if (res.rows.length === 0) {
        return null;
      }

      const updatedUser: SessionUser = res.rows[0];
      return updatedUser;
    } catch (error) {
      errorLog("UserDAO", "editUser");
      throw error;
    }
  }
}

const daoQueries = {
  register: `INSERT INTO users(username,login,hashpassword) VALUES($1,$2,$3) RETURNING id, username, login, hashpassword `,
  findByLogin: `SELECT * FROM users WHERE login=$1 LIMIT 1`,
  editUser: (fields: string[], index: number) =>
    `UPDATE users SET ${fields.join(", ")} WHERE id=${index} RETURNING id, username, login `,
};

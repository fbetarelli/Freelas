import bcrypt from "bcrypt";
import { CustomError } from "../Error/error.ts";
import { UserDAO } from "./dao.ts";
import { User } from "./types.ts";

const userDAO = new UserDAO();
const saltRounds = 10;

export const login = async (login: string, password: string) => {
  const user = await userDAO.findByLogin(login);
  if (user === null) {
    return { user };
  }

  const validate = await bcrypt.compare(password, user.hashPassword);
  if (!validate) {
    return { user: null };
  }
  return { user };
};

export const register = async (
  username: string,
  login: string,
  password: string,
): Promise<{ err: CustomError } | { user: Omit<User, "hashPassword"> }> => {
  const check = await userDAO.findByLogin(login);
  const hasLogin = check !== null;
  if (hasLogin) {
    const err = new CustomError(409, "Cadastro Existente");
    return { err };
  }
  const hash = await bcrypt.hash(password, saltRounds);

  const user = await userDAO.register({ username, login, hashPassword: hash });
  return { user };
};

export const editUser = async ({
  hashPassword: password,
  ...user
}: Partial<User> & { id: string }) => {
  let hash = undefined;

  if (password) {
    hash = await bcrypt.hash(password, saltRounds);
  }

  return await userDAO.editUser({
    ...user,
    hashPassword: hash,
  });
};

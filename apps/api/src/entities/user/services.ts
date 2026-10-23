import bcrypt from "bcrypt";
import { formatValueToString } from "../../utils/formatting-helpers.ts";
import { BadRequestError, ConflictError, NotFoundError } from "../errors/errors.ts";
import { JobDAO } from "../job/dao.ts";
import { UserDAO } from "./dao.ts";
import { type User } from "./types.ts";
import type { EditUser } from "@freelancemanager/shared";

const userDAO = new UserDAO();
const saltRounds = 10;
const DUMMYHASH = bcrypt.hashSync("dummyPassword", saltRounds);

export const login = async (login: string, password: string) => {
  const user = await userDAO.findByLogin(login);

  const passwordHash = user?.hashPassword ?? DUMMYHASH;
  const isValid = await bcrypt.compare(password, passwordHash);

  if (!isValid || user === null) {
    throw new BadRequestError("Invalid email or password");
  }
  return user;
};

export const getUserById = async (id: string) => {
  const user = await userDAO.findById(id);
  if (!user) {
    throw new NotFoundError("User not found");
  }
  return user;
};

export const register = async (
  username: string,
  login: string,
  password: string,
): Promise<Omit<User, "hashPassword">> => {
  const check = await userDAO.findByLogin(login);
  const hasLogin = check !== null;
  if (hasLogin) {
    throw new ConflictError("Login already exists");
  }
  const hash = await bcrypt.hash(password, saltRounds);

  return await userDAO.register({ username, login, hashPassword: hash });
};

export const editUser = async ({
  password,
  id,
  login,
  username,
}: EditUser & { id: string }) => {
  if (login !== undefined) {
    const existingUser = await userDAO.findByLogin(login);
    if (existingUser !== null && existingUser.id !== id) {
      throw new ConflictError("Login already exists");
    }
  }

  let hash: string | undefined;
  if (password !== undefined) {
    hash = await bcrypt.hash(password, saltRounds);
  }

  return await userDAO.editUser({
    id,
    username,
    login,
    hashPassword: hash,
  });
};

export const getProfitFromLastMonth = async (userid: string) => {
  const profit = await userDAO.getProfitFromLastMonth(userid);
  return formatValueToString(profit);
};

export const getJobCount = async (userid: string) => {
  return await new JobDAO().getJobCount(userid);
};

import bcrypt from "bcrypt";
import { formatValueToString } from "../../utils/formatting-helpers.ts";
import { BadRequestError, ConflictError } from "../errors/errors.ts";
import { JobDAO } from "../job/dao.ts";
import { MaterialDAO } from "../material/dao.ts";
import { PaymentDAO } from "../payment/dao.ts";
import { UserDAO } from "./dao.ts";
import { type User } from "./types.ts";

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
  hashPassword: password,
  id,
  login,
  username,
}: Partial<User> & { id: string }) => {
  const incomingUser = {
    id,
    ...(username?.trim() !== "" && { username }),
    ...(login?.trim() !== "" && { login }),
  };

  let hash = undefined;
  if (password) {
    hash = await bcrypt.hash(password, saltRounds);
  }

  return await userDAO.editUser({
    ...incomingUser,
    hashPassword: hash,
  });
};

export const getProfitFromLastMonth = async (userid: string) => {
  const paymentTotal = await new PaymentDAO().getTotalFromLastMonth(userid);
  const materialTotal = await new MaterialDAO().getTotalFromLastMonth(userid);

  const final = paymentTotal - materialTotal;
  return formatValueToString(final);
};

export const getJobCount = async (userid: string) => {
  return await new JobDAO().getJobCount(userid);
};

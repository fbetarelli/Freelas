import { UserDAO } from "../../src/entities/user/dao.ts";
import bcrypt from "bcrypt";
const dao = new UserDAO();

export const coldRegisterUser = async () => {
  const user = { login: "a@a.com", username: "Test User" };
  await dao.register({
    hashPassword: await bcrypt.hash("123", 10),
    ...user,
  });
  return user;
};

import bcrypt from "bcrypt";
import { formatarValor } from "../../utils/formattingHelpers.ts";
import { UserDAO } from "./user-DAO.ts";
import { JobDAO } from "../Job/job-DAO.ts";
import { MaterialDAO } from "../Material/material-DAO.ts";
import { PaymentDAO } from "../Payment/payment-DAO.ts";

export const login = async (login: string, password: string) => {
  let dao = new UserDAO();
  let user = await dao.findByLogin(login);
  if (user) {
    let validate = await bcrypt.compare(password, user.gethashPassword()!);
    if (validate) {
      return { user };
    }
  }
  return { user: null };
};
export const register = async (
  username: string,
  login: string,
  password: string,
) => {
  let dao = new UserDAO();
  let check = await dao.findByLogin(login);

  if (check) {
    const err = Object.assign(new Error(), {
      customMessage: "Cadastro Existente",
      code: 409,
    });
    return { err };
  }

  let saltRounds = 10;
  let hash = await bcrypt.hash(password, saltRounds);

  let user = await dao.register({ username, login, hashPassword: hash });
  return { user };
};

export const editUser = async (
  id: string,
  username: string,
  login: string,
  password: string,
) => {
  let hash = null;
  let saltRounds = 10;
  if (password) {
    hash = await bcrypt.hash(password, saltRounds);
  }

  const user = {
    id: id,
    username: username,
    login: login,
    hashPassword: hash || password,
  };

  let dao = new UserDAO();
  let res = await dao.editUser(user);

  return res;
};
export const getProfitFromLastMonth = async (userid: string) => {
  let paymentDao = new PaymentDAO();
  let materialDao = new MaterialDAO();

  let paymentTotal = await paymentDao.getTotalFromLastMonth(userid);
  let materialTotal = await materialDao.getTotalFromLastMonth(userid);

  const final = Number(paymentTotal) - Number(materialTotal);
  return { profit: formatarValor(final) };
};

export const getJobCount = async (userid: string) => {
  let dao = new JobDAO();
  let jobcount = await dao.getJobCount(userid);

  return jobcount;
};

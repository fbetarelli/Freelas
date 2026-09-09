import { JobDAO } from "../../resources/Job/job-DAO.ts";
import { MaterialDAO } from "../../resources/Material/material-DAO.ts";
import { PaymentDAO } from "../../resources/Payment/payment-DAO.ts";
import { formatarValor } from "../../utils/formattingHelpers.ts";

export const getProfitFromLastMonth = async (userid: string) => {
  const paymentTotal = await new PaymentDAO().getTotalFromLastMonth(userid);
  const materialTotal = await new MaterialDAO().getTotalFromLastMonth(userid);

  const final = Number(paymentTotal) - Number(materialTotal);
  return { profit: formatarValor(final) };
};

export const getJobCount = async (userid: string) => {
  const jobcount = await new JobDAO().getJobCount(userid);

  return jobcount;
};
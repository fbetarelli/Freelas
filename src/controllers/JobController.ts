// @ts-nocheck

import { assert } from "node:console";
import { Job } from  "../models/Job.ts";
import * as JobServices from  "../services/JobServices.ts";
import * as MaterialServices from  "../services/MaterialServices.ts";
import * as PaymentServices from  "../services/PaymentServices.ts";
import { asyncHandler } from  "../utils/asyncHandler.ts";
import { formatarParaFloat, formatarValor } from  "../utils/formattingHelpers.ts";
import { assertIsString } from  "../utils/assert-is-string.ts";

export const addJob = asyncHandler(async (req, res) => {
  const valorTotal = formatarParaFloat(req.body.totalValue);

  assertIsString(req.params.id, "Client Id");
  const clientId = req.params.id;

  const job = new Job({
    id: "",
    payed: req.body.payed === "true",
    descr: req.body.descr,
    jobDate: req.body.date,
    totalValue: valorTotal,
    clientId,
    userId: req.session.user!.id,
  });

  await JobServices.addJob(job);
  res.redirect(`/client/${req.params.id}`);
});

export const editJob = asyncHandler(async (req, res) => {
  let valorTotal: number | undefined = undefined;
  const id = req.params.id;
  assertIsString(id, "Job Id");
  if (req.body.totalValue) {
    valorTotal = formatarParaFloat(req.body.totalValue);
  }
  const job = new Job({
    id,
    payed: req.body.payed,
    descr: req.body.descr,
    jobDate: req.body.date,
    ...(valorTotal !== undefined
      ? { totalValue: valorTotal }
      : { totalValue: 0 }),
    clientId: req.body.clientId,
    userId: req.session.user!.id,
  });

  await JobServices.editJob(job);
  res.redirect(`/job/${req.params.id}`);
});

export const deleteJob = asyncHandler(async (req, res) => {
  const id = req.params.id;
  assertIsString(id, "Job Id");
  await JobServices.deleteJob(id);
  res.redirect(req.session.returnTo || "/dashboard");
});

export const getJobPage = asyncHandler(async (req, res) => {
  const jobId = req.params.id;
  assertIsString(jobId, "Job Id");

  const jobsRes = await JobServices.getJobById(jobId);
  const materialsRes = await MaterialServices.getMaterialsByJob(jobId);
  const paymentsRes = await PaymentServices.getPaymentsByJob(jobId);

  let paymentsVal = paymentsRes.totalSum;
  let materialsVal = materialsRes.totalSum;
  let profit = formatarValor(paymentsVal - materialsVal);

  res.render("jobPage", {
    job: jobsRes.job,
    materials: materialsRes.materials,
    materialsVal: formatarValor(materialsVal),
    payments: paymentsRes.payments,
    paymentsVal: formatarValor(paymentsVal),
    profit,
  });
});

export const showJobList = asyncHandler(async (req, res) => {
  let page = Number(req.query.page);
  const search = typeof req.query.search === "string" ? req.query.search : null;
  let params = {
    page,
    userId: req.session.user!.id,
    search,
  };

  const totalPages = await JobServices.getJobPages(params);
  const searchQuery = search ? `&search=${encodeURIComponent(search)}` : "";
  if (isNaN(page) || page < 1 || page > totalPages) {
    return res.redirect(`/jobs?page=1${searchQuery}`);
  }

  const jobsResult = await JobServices.getJobListByPage(params);

  return res.render("jobsList", {
    //@ts-ignore
    jobs: jobsResult.jobs,
    totalPages,
    search: req.query.search,
    searchQuery,
    page: page,
  });
});

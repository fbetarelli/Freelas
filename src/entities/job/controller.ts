import { type Request } from "express";
import { assertIsString } from "../../utils/assert-is-string.ts";
import { asyncHandler } from "../../utils/asyncHandler.ts";
import {
  formatValueToFloat,
  formatValueToString,
} from "../../utils/formatting-helpers.ts";
import * as MaterialServices from "../Material/services.ts";
import * as PaymentServices from "../Payment/services.ts";
import * as JobServices from "./services.ts";
import { type FormattedJob, type IncomingJob } from "./types.ts";

export const addJob = asyncHandler(
  async (
    req: Request<{ id: string }, unknown, Omit<IncomingJob, "id">>,
    res,
  ) => {
    const valorTotal = formatValueToFloat(
      req.body.totalValue?.toString() ?? "0",
    );

    assertIsString(req.params.id, "Client Id");
    const clientId = req.params.id;

    const { date: jobDate, ...incoming } = req.body;

    const job = {
      ...incoming,
      jobDate,
      payed: incoming.payed === "true" ? true : false,
      totalValue: valorTotal,
      clientId,
      userId: req.session.user!.id,
    };

    await JobServices.addJob(job);
    res.redirect(`/client/${req.params.id}`);
  },
);

export const editJob = asyncHandler(
  async (req: Request<{ id: string }, unknown, Partial<IncomingJob>>, res) => {
    const totalValue = req.body.totalValue
      ? formatValueToFloat(req.body.totalValue.toString())
      : undefined;

    const id = req.params.id;
    assertIsString(id, "Job Id");

    const { date: jobDate, ...incoming } = req.body;

    const job = {
      ...incoming,
      payed: incoming.payed,
      id,
      jobDate,
      totalValue,
      userId: req.session.user!.id,
    };

    await JobServices.editJob(job);
    res.redirect(`/job/${req.params.id}`);
  },
);

export const deleteJob = asyncHandler(async (req, res) => {
  const id = req.params.id;
  assertIsString(id, "Job Id");
  await JobServices.deleteJob(id);
  res.redirect(req.session.returnTo || "/dashboard");
});

export const getJobPage = asyncHandler(async (req, res) => {
  const jobId = req.params.id;
  let job: FormattedJob | null = null;
  assertIsString(jobId, "Job Id");

  const jobRes = await JobServices.getJobById(jobId);
  const materials = await MaterialServices.getMaterialsByJob(jobId);
  const payments = await PaymentServices.getPaymentsByJob(jobId);

  if (jobRes) {
    job = {
      ...jobRes,
      totalValue: formatValueToString(jobRes.totalValue),
    };
  }

  const profit = formatValueToString(
    payments.totalValue - materials.totalValue,
  );

  res.render("jobPage", {
    job,
    materials: materials.data,
    materialsVal: formatValueToString(materials.totalValue),
    payments: payments.data,
    paymentsVal: formatValueToString(payments.totalValue),
    profit,
  });
});

export const showJobList = asyncHandler(async (req, res) => {
  const incoming = req.query;

  if (req.session.user?.id === undefined) {
    return res.redirect("/login");
  }

  const params = {
    page: Number(incoming.page) ? Number(incoming.page) : 1,
    userId: req.session.user?.id,
    search: typeof incoming.search === "string" ? incoming.search : "",
  };

  const searchQuery = params.search
    ? `&search=${encodeURIComponent(params.search)}`
    : "";

  if (isNaN(params.page) || params.page < 1) {
    return res.redirect(`/jobs?page=1${searchQuery}`);
  }

  const totalPages = await JobServices.getJobPages(params);
  if (params.page > totalPages) {
    return res.redirect(`/jobs?page=1${searchQuery}`);
  }

  const jobs = await JobServices.getJobListByPage(params);

  return res.render("jobsList", {
    jobs,
    totalPages,
    search: req.query.search,
    searchQuery,
    page: params.page,
  });
});

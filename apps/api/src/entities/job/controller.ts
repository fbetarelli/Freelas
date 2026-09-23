import { type Request } from "express";
import { assertIsString } from "../../utils/assert-is-string.ts";
import { asyncHandler } from "../../utils/asyncHandler.ts";
import {
  formatValueToFloat,
  formatValueToString,
} from "../../utils/formatting-helpers.ts";
import { BadRequestError, NotFoundError } from "../errors/errors.ts";
import * as MaterialServices from "../material/services.ts";
import * as PaymentServices from "../payment/services.ts";
import * as JobServices from "./services.ts";
import { type Job } from "./types.ts";

export const addJob = asyncHandler(
  async (req: Request<{ id: string }, unknown, Omit<Job, "id">>, res) => {
    const valorTotal = formatValueToFloat(req.body.totalValue?.toString());

    assertIsString(req.params.id, "Client Id");
    const clientId = req.params.id;

    const job = {
      descr: req.body.descr,
      jobDate: req.body.jobDate,
      payed: req.body.payed,
      totalValue: valorTotal,
      clientId,
      userId: req.session.user!.id,
    };

    const newJob = await JobServices.addJob(job);
    res.status(201).json(newJob);
  },
);

export const editJob = asyncHandler(
  async (req: Request<{ id: string }, unknown, Partial<Job>>, res) => {
    const totalValue = req.body.totalValue
      ? formatValueToFloat(req.body.totalValue.toString())
      : undefined;

    const id = req.params.id;
    assertIsString(id, "Job Id");

    const job = {
      descr: req.body.descr,
      payed: req.body.payed,
      id,
      jobDate: req.body.jobDate,
      totalValue,
      userId: req.session.user!.id,
    };

    const updatedJob = await JobServices.editJob(job);
    if (!updatedJob) {
      throw new NotFoundError("Job not found");
    }
    res.status(200).json(updatedJob);
  },
);

export const deleteJob = asyncHandler(async (req, res) => {
  const id = req.params.id;
  assertIsString(id, "Job Id");
  await JobServices.deleteJob(id);
  res.sendStatus(204);
});

export const getJobPage = asyncHandler(async (req, res) => {
  const jobId = req.params.id;
  assertIsString(jobId, "Job Id");

  const jobRes = await JobServices.getJobById(jobId);
  const materials = await MaterialServices.getMaterialsByJob(jobId);
  const payments = await PaymentServices.getPaymentsByJob(jobId);

  const profit = formatValueToString(
    payments.totalValue - materials.totalValue,
  );

  res.render("jobPage", {
    job: jobRes,
    materials: materials.data,
    materialsVal: formatValueToString(materials.totalValue),
    payments: payments.data,
    paymentsVal: formatValueToString(payments.totalValue),
    profit,
  });
});
export const getById = asyncHandler(async (req, res) => {
  const jobId = req.params.id;
  assertIsString(jobId, "Job Id");

  const job = await JobServices.getJobById(jobId);
  res.status(200).json(job);
});

export const getByClient = asyncHandler(async (req, res) => {
  const clientId = req.params.id;
  assertIsString(clientId, "Client Id");

  const jobs = await JobServices.getJobsByClient(clientId);
  res.status(200).json(jobs);
});

export const showJobList = asyncHandler(async (req, res) => {
  const incoming = req.query;

  const params = {
    page: Number(incoming.page) ? Number(incoming.page) : 1,
    userId: req.session.user!.id,
    search: typeof incoming.search === "string" ? incoming.search : "",
  };

  if (isNaN(params.page) || params.page < 1) {
    throw new BadRequestError("Invalid page number");
  }

  const totalPages = await JobServices.getJobPages(params);
  if (params.page > totalPages) {
    throw new BadRequestError("Page number higher than total");
  }

  const jobs = await JobServices.getJobListByPage(params);

  return res.status(200).json({
    jobs,
    totalPages,
  });
});

import type {
  EditJob,
  GetClient,
  GetJob,
  RegisterJob,
} from "@freelancemanager/shared";
import { type Request } from "express";
import { assertIsString } from "../../utils/assert-is-string.ts";
import { asyncHandler } from "../../utils/asyncHandler.ts";
import { formatValueToFloat } from "../../utils/formatting-helpers.ts";
import { BadRequestError, NotFoundError } from "../errors/errors.ts";
import * as JobServices from "./services.ts";

export const addJob = asyncHandler(
  async (req: Request<GetClient, unknown, RegisterJob>, res) => {
    const valorTotal = formatValueToFloat(req.body.totalValue?.toString());

    assertIsString(req.params.id, "Client Id");
    const clientId = req.params.id;

    const job = {
      descr: req.body.descr,
      jobDate: req.body.jobDate,
      payed: req.body.payed,
      totalValue: valorTotal,
      clientId,
      userId: req.user!.id,
    };

    const newJob = await JobServices.addJob(job);
    res.status(201).json(newJob);
  },
);

export const editJob = asyncHandler(
  async (req: Request<GetJob, unknown, EditJob>, res) => {
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
      userId: req.user!.id,
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

export const getById = asyncHandler(async (req, res) => {
  const jobId = req.params.id as string;

  const job = await JobServices.getJobById(jobId);
  res.status(200).json(job);
});

export const getByClient = asyncHandler(async (req, res) => {
  const clientId = req.params.id as string;

  const jobs = await JobServices.getJobsByClient(clientId);
  res.status(200).json(jobs);
});

export const showJobList = asyncHandler(async (req, res) => {
  const incoming = req.query;

  const params = {
    page: Number(incoming.page) ? Number(incoming.page) : 1,
    userId: req.user!.id,
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

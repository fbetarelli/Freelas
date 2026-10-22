import type {
  EditJob,
  GetClient,
  GetJob,
  PaginatedSearch,
  RegisterJob,
} from "@freelancemanager/shared";
import { type Request } from "express";
import { assertIsString } from "../../utils/assert-is-string.ts";
import { asyncHandler } from "../../utils/asyncHandler.ts";
import { requireUser } from "../../features/auth/require-user.ts";
import { formatValueToFloat } from "../../utils/formatting-helpers.ts";
import { NotFoundError } from "../errors/errors.ts";
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
      userId: requireUser(req).id,
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
    };

    const updatedJob = await JobServices.editJob(job, requireUser(req).id);
    if (!updatedJob) {
      throw new NotFoundError("Job not found");
    }
    res.status(200).json(updatedJob);
  },
);

export const deleteJob = asyncHandler(async (req, res) => {
  const id = req.params.id;
  assertIsString(id, "Job Id");
  await JobServices.deleteJob(id, requireUser(req).id);
  res.sendStatus(204);
});

export const getById = asyncHandler(async (req, res) => {
  const jobId = req.params.id as string;

  const job = await JobServices.getJobById(jobId, requireUser(req).id);
  res.status(200).json(job);
});

export const getByClient = asyncHandler(async (req, res) => {
  const clientId = req.params.id as string;

  const jobs = await JobServices.getJobsByClient(
    clientId,
    requireUser(req).id,
  );
  res.status(200).json(jobs);
});

export const showJobList = asyncHandler(
  async (req: Request<unknown, unknown, unknown, PaginatedSearch>, res) => {
    const incoming = req.query;

    const params = {
      page: incoming.page ? incoming.page : 1,
      userId: requireUser(req).id,
      search: incoming.search ? incoming.search.trim() : "",
    };

    const totalPages = await JobServices.getJobPages(params);

    const jobs = await JobServices.getJobListByPage(params);

    return res.status(200).json({
      jobs,
      totalPages,
    });
  },
);

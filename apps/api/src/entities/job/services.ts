import { type SearchObject } from "../../types/search-types.ts";
import { removeUndefined } from "../../utils/remove-undefined.ts";
import { NotFoundError } from "../errors/errors.ts";
import { JobDAO } from "./dao.ts";
import { type Job } from "./types.ts";
import { mapToJob } from "./utils/mapper.ts";

const dao = new JobDAO();

export const addJob = async (job: Omit<Job, "id">) => {
  const dbJob = await dao.addJob(job);
  if (!dbJob) {
    throw new NotFoundError("Job not found");
  }
  return mapToJob(dbJob);
};
export const editJob = async (
  incomingJob: Partial<Job> & {
    id: string;
  },
) => {
  const { descr, jobDate, payed: incomingPayed, totalValue } = incomingJob;
  const jobWithoutId = removeUndefined({
    descr: descr?.trim() !== "" ? descr : undefined,
    jobDate: jobDate?.trim() !== "" ? jobDate : undefined,
    payed: incomingPayed !== undefined ? incomingPayed : undefined,
    totalValue: totalValue !== undefined ? totalValue : undefined,
  });

  const job = {
    ...jobWithoutId,
    id: incomingJob.id,
  };

  const dbJob = await dao.editJob(job);
  if (!dbJob) {
    throw new NotFoundError("Job not found");
  }
  return mapToJob(dbJob);
};
export const deleteJob = async (jobId: string) => {
  return await dao.deleteJob(jobId);
};

export const getJobById = async (id: string) => {
  const dbJob = await dao.getJobById(id);
  if (!dbJob) {
    throw new NotFoundError("Job not found");
  }
  return mapToJob(dbJob);
};

export const getJobsByClient = async (clientId: string) => {
  const jobs = await dao.getJobsByClient(clientId);
  return jobs.map(mapToJob);
};

export const getLastJobsByUser = async (userId: string) => {
  const jobs = await dao.getLastJobsByUser(userId);
  return jobs.map(mapToJob);
};

export const getJobListByPage = async (query: SearchObject) => {
  const params = {
    ...query,
    page: (query.page - 1) * 10,
  };
  const jobs = await dao.getJobListByPage(params);
  return jobs.map(mapToJob);
};

export const getJobPages = async (params: {
  userId: string;
  search: string | null;
}) => {
  const total = await dao.getJobListCount(params);

  return Math.max(1, Math.ceil(total / 10));
};

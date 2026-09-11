import { type SearchObject } from "../../types/search-types.ts";
import { JobDAO } from "./dao.ts";
import { type Job } from "./types.ts";

const dao = new JobDAO();

export const addJob = async (job: Omit<Job, "id">) => {
  return await dao.addJob(job);
};
export const editJob = async (
  incomingJob: Partial<Omit<Job, "payed">> & {
    id: string;
    payed: "true" | "false" | undefined;
  },
) => {
  const {
    id,
    clientId,
    descr,
    jobDate,
    payed: incomingPayed,
    totalValue,
    userId,
  } = incomingJob;

  const job = {
    id,
    clientId,
    userId,
    ...(descr?.trim() !== "" && { descr }),
    ...(jobDate?.trim() !== "" && { jobDate }),
    payed:
      incomingPayed === "true"
        ? true
        : incomingPayed === "false"
          ? false
          : undefined,
    ...(jobDate && { jobDate: jobDate }),
    ...(totalValue !== undefined && { totalValue }),
  };

  return await dao.editJob(job);
};
export const deleteJob = async (jobId: string) => {
  return await dao.deleteJob(jobId);
};

export const getJobById = async (id: string) => {
  return await dao.getJobById(id);
};

export const getJobsByClient = async (clientId: string) => {
  return await dao.getJobsByClient(clientId);
};

export const getLastJobsByUser = async (userId: string) => {
  return await dao.getLastJobsByUser(userId);
};

export const getJobListByPage = async (query: SearchObject) => {
  const params = {
    ...query,
    page: (query.page - 1) * 10,
  };
  return await dao.getJobListByPage(params);
};

export const getJobPages = async (params: {
  userId: string;
  search: string | null;
}) => {
  const total = await dao.getJobListCount(params);

  return Math.max(1, Math.ceil(total / 10));
};

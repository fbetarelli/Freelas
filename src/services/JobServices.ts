import { JobDAO } from  "../repositories/JobDAO.ts";
import { runDAO } from  "../utils/serviceHelper.ts";
import { toDTO } from  "../mappers/JobMapper.ts";
import { Job } from  "../models/Job.ts";

const dao = new JobDAO();

export const addJob = async (job: Job) => {
  return runDAO(dao, "addJob", job);
};
export const editJob = async (job: Job) => {
  return runDAO(dao, "editJob", job);
};
export const deleteJob = async (jobId: string) => {
  return runDAO(dao, "deleteJob", jobId);
};

export const getJobById = async (id: string) => {
  return runDAO(dao, "getJobById", id, toDTO, "job");
};

export const getJobsByClient = async (clientId: string) => {
  return runDAO(dao, "getJobsByClient", clientId, toDTO, "jobsArray");
};

export const getLastJobsByUser = async (userId: string) => {
  return runDAO(dao, "getLastJobsByUser", userId, toDTO, "jobs");
};

export const getJobListByPage = async (params: {
  page: number;
  userId: string;
  search: string | null;
}) => {
  params.page -= 1;
  params.page *= 10;
  return runDAO(dao, "getJobListByPage", params, toDTO, "jobs");
};

export const getJobPages = async (params: {
  userId: string;
  search: string | null;
}) => {
  let total = await dao.getJobListCount(params);

  return Math.max(1, Math.ceil(total / 10));
};

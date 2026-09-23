import { describe, expect, it } from "vitest";
import {
  createTestClient,
  createTestJob,
  registerAndLogin,
} from "../../../../tests/utils/setup-helpers.ts";
import { formatValueToString } from "../../../utils/formatting-helpers.ts";

const getExpectedJob = (job: {
  descr: string;
  jobDate: string;
  payed: boolean;
  totalValue: number;
}) => ({
  ...job,
  payed: job.payed ? "Pagamento Realizado" : "Aguardando Pagamento",
  jobDate: job.jobDate.split("-").reverse().join("/"),
  totalValue: formatValueToString(job.totalValue),
});

describe("Job E2E Tests", () => {
  it("should add a job", async () => {
    const userAgent = await registerAndLogin();
    const client = await createTestClient(userAgent);
    const jobData = {
      descr: "Test Job",
      jobDate: "2023-06-01",
      payed: false,
      totalValue: 100.0,
    };
    const response = await userAgent
      .post(`/clients/${client.id}/jobs`)
      .send(jobData);
    expect(response.status).toBe(201);
    expect(response.body).toMatchObject(getExpectedJob(jobData));
  });
  it("should edit a job", async () => {
    const userAgent = await registerAndLogin();
    const client = await createTestClient(userAgent);
    const job = await createTestJob(userAgent, client.id);
    const updatedJobData = {
      descr: "Updated Test Job",
      jobDate: "2023-06-02",
      payed: true,
      totalValue: 200.0,
    };
    const response = await userAgent
      .patch(`/jobs/${job.id}`)
      .send(updatedJobData);
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject(getExpectedJob(updatedJobData));
  });
  it("should get a job by its id", async () => {
    const userAgent = await registerAndLogin();
    const client = await createTestClient(userAgent);
    const job = await createTestJob(userAgent, client.id);
    const response = await userAgent.get(`/jobs/${job.id}`);
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject(job);
  });
  it("should delete a job", async () => {
    const userAgent = await registerAndLogin();
    const client = await createTestClient(userAgent);
    const job = await createTestJob(userAgent, client.id);
    const response = await userAgent.delete(`/jobs/${job.id}`);
    expect(response.status).toBe(204);
  });
  it("should get jobs by client ID", async () => {
    const userAgent = await registerAndLogin();
    const client = await createTestClient(userAgent);
    const job = await createTestJob(userAgent, client.id);
    const response = await userAgent.get(`/clients/${client.id}/jobs`);
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject([job]);
  });
  it("should get all jobs from page 1", async () => {
    const userAgent = await registerAndLogin();
    const c1 = await createTestClient(userAgent);
    const j1 = await createTestJob(userAgent, c1.id);
    const c2 = await createTestClient(userAgent);
    const j2 = await createTestJob(userAgent, c2.id);
    const response = await userAgent.get(`/jobs`);
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ jobs: [j1, j2], totalPages: 1 });
  });
});

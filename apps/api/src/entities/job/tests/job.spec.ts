import { describe, expect, it } from "vitest";
import {
  JobArrayResponseZodSchema,
  JobListResponseZodSchema,
  JobResponseZodSchema,
} from "@freelancemanager/shared";
import {
  createTestClient,
  createTestJob,
  makeJob,
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
    const jobData = makeJob();
    const response = await userAgent
      .post(`/clients/${client.id}/jobs`)
      .send(jobData);
    expect(response.status).toBe(201);
    JobResponseZodSchema.parse(response.body);
    expect(response.body).toMatchObject(getExpectedJob(jobData));
  });
  it("preserves decimal money values on create and edit", async () => {
    const userAgent = await registerAndLogin();
    const client = await createTestClient(userAgent);
    const response = await userAgent
      .post(`/clients/${client.id}/jobs`)
      .send({ ...makeJob(), totalValue: 123.45 });

    expect(response.status).toBe(201);
    const created = response.body as { id: string; totalValue: string };
    expect(created.totalValue).toBe("123,45");

    const editResponse = await userAgent
      .patch(`/jobs/${created.id}`)
      .send({ totalValue: 234.56 });

    expect(editResponse.status).toBe(200);
    expect((editResponse.body as { totalValue: string }).totalValue).toBe("234,56");
  });
  it("should not add a job with invalid data", async () => {
    const userAgent = await registerAndLogin();
    const client = await createTestClient(userAgent);
    const jobData = { ...makeJob(), descr: undefined };
    const response = await userAgent
      .post(`/clients/${client.id}/jobs`)
      .send(jobData);
    expect(response.status).toBe(400);
  });
  it.each(["jobDate", "descr", "payed", "totalValue"])(
    "rejects null required job field: %s",
    async (field) => {
      const userAgent = await registerAndLogin();
      const client = await createTestClient(userAgent);
      const response = await userAgent
        .post(`/clients/${client.id}/jobs`)
        .send({ ...makeJob(), [field]: null });

      expect(response.status).toBe(400);
    },
  );
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
    JobResponseZodSchema.parse(response.body);
    expect(response.body).toMatchObject(getExpectedJob(updatedJobData));
  });
  it.each(["jobDate", "descr", "payed", "totalValue"])(
    "rejects clearing required job field: %s",
    async (field) => {
      const userAgent = await registerAndLogin();
      const client = await createTestClient(userAgent);
      const job = await createTestJob(userAgent, client.id);
      const response = await userAgent
        .patch(`/jobs/${job.id}`)
        .send({ [field]: null });

      expect(response.status).toBe(400);
      const getResponse = await userAgent.get(`/jobs/${job.id}`);
      expect(getResponse.body).toMatchObject(job);
    },
  );
  it("rejects an unknown job field", async () => {
    const userAgent = await registerAndLogin();
    const client = await createTestClient(userAgent);
    const job = await createTestJob(userAgent, client.id);

    const response = await userAgent
      .patch(`/jobs/${job.id}`)
      .send({ descr: "Changed", unexpected: true });

    expect(response.status).toBe(400);
  });
  it("rejects an empty job patch", async () => {
    const userAgent = await registerAndLogin();
    const client = await createTestClient(userAgent);
    const job = await createTestJob(userAgent, client.id);

    const response = await userAgent.patch(`/jobs/${job.id}`).send({});

    expect(response.status).toBe(400);
  });
  it("should get a job by its id", async () => {
    const userAgent = await registerAndLogin();
    const client = await createTestClient(userAgent);
    const job = await createTestJob(userAgent, client.id);
    const response = await userAgent.get(`/jobs/${job.id}`);
    expect(response.status).toBe(200);
    JobResponseZodSchema.parse(response.body);
    expect(response.body).toMatchObject(job);
  });
  it("should not get a job with an invalid id", async () => {
    const userAgent = await registerAndLogin();
    const client = await createTestClient(userAgent);
    await createTestJob(userAgent, client.id);
    const response = await userAgent.get(`/jobs/${123}`);
    expect(response.status).toBe(400);
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
    JobArrayResponseZodSchema.parse(response.body);
    expect(response.body).toMatchObject([job]);
  });
  it("should not get jobs by client ID with an invalid client ID", async () => {
    const userAgent = await registerAndLogin();
    const client = await createTestClient(userAgent);
    await createTestJob(userAgent, client.id);
    const response = await userAgent.get(`/clients/${123}/jobs`);
    expect(response.status).toBe(400);
  });
  it("should get all jobs from page 1", async () => {
    const userAgent = await registerAndLogin();
    const c1 = await createTestClient(userAgent);
    const j1 = await createTestJob(userAgent, c1.id);
    const c2 = await createTestClient(userAgent);
    const j2 = await createTestJob(userAgent, c2.id);
    const response = await userAgent.get(`/jobs`);
    expect(response.status).toBe(200);
    JobListResponseZodSchema.parse(response.body);
    expect(response.body).toMatchObject({ jobs: [j1, j2], totalPages: 1 });
  });
  it("should not get all jobs from page 1 with invalid query parameters", async () => {
    const userAgent = await registerAndLogin();
    const response = await userAgent.get(`/jobs?page=invalid`);
    expect(response.status).toBe(400);
  });
  it.each([
    ["ordinary", "Ordinary Search Job"],
    ["%", "literal%job"],
    ["_", "literal_job"],
    ["\\", "literal\\job"],
  ])("searches %s literally and consistently", async (search, descr) => {
    const userAgent = await registerAndLogin();
    const client = await createTestClient(userAgent);
    await userAgent
      .post(`/clients/${client.id}/jobs`)
      .send({ ...makeJob(), descr });

    const response = await userAgent.get("/jobs").query({ search });

    expect(response.status).toBe(200);
    const body = response.body as {
      totalPages: number;
      jobs: Array<{ descr: string }>;
    };
    expect(body.totalPages).toBe(1);
    expect(body.jobs).toHaveLength(1);
    expect(body.jobs[0].descr).toBe(descr);
  });
});

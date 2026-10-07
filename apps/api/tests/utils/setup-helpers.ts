import request from "supertest";
import { app } from "../../app.ts";
import type { Client } from "../../src/entities/client/types.ts";
import type { FormattedJob } from "../../src/entities/job/types.ts";
import type { FormattedMaterial } from "../../src/entities/material/types.ts";
import type { FormattedPayment } from "../../src/entities/payment/types.ts";

export const testUser = {
  login: `${Math.random()}@a.com`,
  username: "Test User",
  password: "123",
};
export const testClient = {
  name: "Test Client",
  address: "123 Main St",
  contact: "555-1234",
};
export const testJob = {
  descr: "Test Job",
  jobDate: "2023-06-01",
  payed: false,
  totalValue: 100.0,
};
export const testMaterial = {
  descr: "Test Material",
  supplier: "Test Supplier",
  qnt: 10,
  unitaryVal: 100.0,
};
export const testPayment = {
  value: 100.0,
  paymentDate: "2023-06-01",
  method: "Credit Card",
  installment: 1,
};

export const registerAndLogin = async () => {
  const agent = request.agent(app);
  await agent.post("/register").send(testUser);
  return agent;
};

export const createTestClient = async (
  agent: ReturnType<typeof request.agent>,
) => {
  const clientResponse = await agent.post("/clients").send(testClient);

  return clientResponse.body as Client;
};
export const createTestJob = async (
  agent: ReturnType<typeof request.agent>,
  clientId: string,
) => {
  const jobResponse = await agent
    .post(`/clients/${clientId}/jobs`)
    .send(testJob);

  return jobResponse.body as FormattedJob;
};
export const createTestMaterial = async (
  agent: ReturnType<typeof request.agent>,
  jobId: string,
) => {
  const materialResponse = await agent
    .post(`/jobs/${jobId}/materials`)
    .send(testMaterial);

  return materialResponse.body as FormattedMaterial;
};
export const createTestPayment = async (
  agent: ReturnType<typeof request.agent>,
  jobId: string,
) => {
  const paymentResponse = await agent
    .post(`/jobs/${jobId}/payments`)
    .send(testPayment);

  return paymentResponse.body as FormattedPayment;
};

export const setupJob = async () => {
  const userAgent = await registerAndLogin();
  const { id: clientId } = await createTestClient(userAgent);
  const { id: jobId } = await createTestJob(userAgent, clientId);
  return { userAgent, clientId, jobId };
};

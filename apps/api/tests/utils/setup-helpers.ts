import request from "supertest";
import { randomUUID } from "node:crypto";
import { app } from "../../app.ts";
import type { Client } from "../../src/entities/client/types.ts";
import type { FormattedJob } from "../../src/entities/job/types.ts";
import type { FormattedMaterial } from "../../src/entities/material/types.ts";
import type { FormattedPayment } from "../../src/entities/payment/types.ts";

export const makeUser = () => ({
  login: `${randomUUID()}@a.com`,
  username: "Test User",
  password: "123",
});
export const makeClient = () => ({
  name: "Test Client",
  address: "123 Main St",
  contact: "555-1234",
});
export const makeJob = () => ({
  descr: "Test Job",
  jobDate: "2023-06-01",
  payed: false,
  totalValue: 100.0,
});
export const makeMaterial = () => ({
  descr: "Test Material",
  supplier: "Test Supplier",
  qnt: 10,
  unitaryVal: 100.0,
});
export const makePayment = () => ({
  value: 100.0,
  paymentDate: "2023-06-01",
  method: "Credit Card",
  installment: 1,
});

const assertSetupResponse: <T extends { id: string }>(
  step: string,
  status: number,
  body: unknown,
) => asserts body is T = (step, status, body) => {
  if (
    status < 200 ||
    status >= 300 ||
    typeof body !== "object" ||
    body === null ||
    !("id" in body) ||
    typeof body.id !== "string"
  ) {
    throw new Error(
      `${step} failed with status ${status}: expected a 2xx response with a string id`,
    );
  }
};

export const registerAndLogin = async () => {
  const agent = request.agent(app);
  const response = await agent.post("/register").send(makeUser());
  assertSetupResponse("registerAndLogin", response.status, response.body);
  return agent;
};

export const createTestClient = async (
  agent: ReturnType<typeof request.agent>,
) => {
  const clientResponse = await agent.post("/clients").send(makeClient());
  const body: unknown = clientResponse.body;

  assertSetupResponse<Client>("createTestClient", clientResponse.status, body);
  return body;
};
export const createTestJob = async (
  agent: ReturnType<typeof request.agent>,
  clientId: string,
) => {
  const jobResponse = await agent
    .post(`/clients/${clientId}/jobs`)
    .send(makeJob());
  const body: unknown = jobResponse.body;

  assertSetupResponse<FormattedJob>("createTestJob", jobResponse.status, body);
  return body;
};
export const createTestMaterial = async (
  agent: ReturnType<typeof request.agent>,
  jobId: string,
) => {
  const materialResponse = await agent
    .post(`/jobs/${jobId}/materials`)
    .send(makeMaterial());
  const body: unknown = materialResponse.body;

  assertSetupResponse<FormattedMaterial>(
    "createTestMaterial",
    materialResponse.status,
    body,
  );
  return body;
};
export const createTestPayment = async (
  agent: ReturnType<typeof request.agent>,
  jobId: string,
  payment = makePayment(),
) => {
  const paymentResponse = await agent
    .post(`/jobs/${jobId}/payments`)
    .send(payment);
  const body: unknown = paymentResponse.body;

  assertSetupResponse<FormattedPayment>(
    "createTestPayment",
    paymentResponse.status,
    body,
  );
  return body;
};

export const setupJob = async () => {
  const userAgent = await registerAndLogin();
  const { id: clientId } = await createTestClient(userAgent);
  const { id: jobId } = await createTestJob(userAgent, clientId);
  return { userAgent, clientId, jobId };
};

import request from "supertest";
import { app } from "../../app.ts";
import type { Client } from "../../src/entities/client/types.ts";
import type { FormattedJob } from "../../src/entities/job/types.ts";

export const testUser = {
  login: "a@a.com",
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

export const registerAndLogin = async () => {
  const agent = request.agent(app);
  await agent.post("/register").send(testUser);
  return agent;
};

export const createTestClient = async (
  agent: ReturnType<typeof request.agent>,
) => {
  const clientResponse = await agent.post("/add-client").send(testClient);

  return clientResponse.body as Client;
};
export const createTestJob = async (
  agent: ReturnType<typeof request.agent>,
  clientId: string,
) => {
  const jobResponse = await agent
    .post(`/client/${clientId}/add-job`)
    .send(testJob);

  return jobResponse.body as FormattedJob;
};

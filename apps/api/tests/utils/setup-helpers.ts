import request from "supertest";
import { app } from "../../app.ts";
import type { Client } from "../../src/entities/client/types.ts";

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

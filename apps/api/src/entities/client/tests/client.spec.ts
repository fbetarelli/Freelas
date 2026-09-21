import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "../../../../app.ts";
import {
  createTestClient,
  registerAndLogin,
  testClient,
} from "../../../../tests/utils/setup-helpers.ts";

const agent = request.agent(app);

describe("Client Controller E2E", () => {
  it("should fail adding a new client without login", async () => {
    const clientResponse = await agent.post("/add-client").send(testClient);
    expect(clientResponse.status).toBe(401);
  });

  it("should add a new client successfully", async () => {
    const userAgent = await registerAndLogin();

    const clientResponse = await userAgent.post("/add-client").send(testClient);
    expect(clientResponse.status).toBe(201);
    expect(clientResponse.body).toMatchObject(testClient);
  });

  it("should delete a client successfully", async () => {
    const userAgent = await registerAndLogin();
    const response = await createTestClient(userAgent);

    const deleteResponse = await userAgent.delete(
      `/client/${response.id}/delete`,
    );
    expect(deleteResponse.status).toBe(204);
  });
  it("should edit client successfully", async () => {
    const userAgent = await registerAndLogin();
    const response = await createTestClient(userAgent);

    const updatedClient = {
      name: "Updated Client",
      address: "456 Oak Ave",
      contact: "555-5678",
    };

    const editResponse = await userAgent
      .patch(`/client/${response.id}/edit`)
      .send(updatedClient);
    expect(editResponse.status).toBe(200);
    expect(editResponse.body).toMatchObject(updatedClient);
  });
  it("should not edit client without proper authentication", async () => {
    const userAgent = await registerAndLogin();
    const response = await createTestClient(userAgent);

    await userAgent.post("/register").send({
      login: "b@b.com",
      username: "Test User",
      password: "123",
    });

    const updatedClient = {
      name: "Updated Client",
      address: "456 Oak Ave",
      contact: "555-5678",
    };

    const editResponse = await userAgent
      .patch(`/client/${response.id}/edit`)
      .send(updatedClient);
    expect(editResponse.status).toBe(403);
    expect(editResponse.body).toHaveProperty("message");
  });
  it("should get client by id", async () => {
    const userAgent = await registerAndLogin();
    const client = await createTestClient(userAgent);

    const getResponse = await userAgent.get(`/client/${client.id}`);
    expect(getResponse.status).toBe(200);
    expect(getResponse.body).toMatchObject(client);
  });
  it("should get client list", async () => {
    const userAgent = await registerAndLogin();
    const client = await createTestClient(userAgent);
    const expected = {
      totalPages: 1,
      clients: [client],
    };

    const getResponse = await userAgent.get(`/clients`);
    expect(getResponse.status).toBe(200);
    expect(getResponse.body).toMatchObject(expected);
  });
});

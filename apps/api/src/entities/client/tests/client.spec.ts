import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "../../../../app.ts";
import {
  createTestClient,
  makeClient,
  registerAndLogin,
} from "../../../../tests/utils/setup-helpers.ts";

const agent = request.agent(app);

describe("Client Controller E2E", () => {
  it("should fail adding a new client without login", async () => {
    const clientResponse = await agent.post("/clients").send(makeClient());
    expect(clientResponse.status).toBe(401);
  });

  it("should add a new client successfully", async () => {
    const userAgent = await registerAndLogin();

    const client = makeClient();
    const clientResponse = await userAgent.post("/clients").send(client);
    expect(clientResponse.status).toBe(201);
    expect(clientResponse.body).toMatchObject(client);
  });
  it("should not add a new client without required fields", async () => {
    const userAgent = await registerAndLogin();

    const clientResponse = await userAgent.post("/clients").send({
      address: "123 Main St",
      contact: "555-1234",
    });
    expect(clientResponse.status).toBe(400);
    expect(clientResponse.body).toMatchObject({
      message: "Client name is required",
    });
  });
  it("persists a null client address", async () => {
    const userAgent = await registerAndLogin();
    const response = await userAgent.post("/clients").send({
      ...makeClient(),
      address: null,
    });

    expect(response.status).toBe(201);
    expect((response.body as { address: string | null }).address).toBeNull();
  });
  it.each(["contact"])("rejects null required client field: %s", async (field) => {
    const userAgent = await registerAndLogin();
    const response = await userAgent.post("/clients").send({
      ...makeClient(),
      [field]: null,
    });

    expect(response.status).toBe(400);
  });

  it("should delete a client successfully", async () => {
    const userAgent = await registerAndLogin();
    const response = await createTestClient(userAgent);

    const deleteResponse = await userAgent.delete(`/clients/${response.id}`);
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
      .patch(`/clients/${response.id}`)
      .send(updatedClient);
    expect(editResponse.status).toBe(200);
    expect(editResponse.body).toMatchObject(updatedClient);
  });
  it("rejects unknown fields and preserves the client", async () => {
    const userAgent = await registerAndLogin();
    const client = await createTestClient(userAgent);

    const editResponse = await userAgent
      .patch(`/clients/${client.id}`)
      .send({ name: "Changed", id: client.id });

    expect(editResponse.status).toBe(400);
    const getResponse = await userAgent.get(`/clients/${client.id}`);
    expect(getResponse.body).toMatchObject(client);
  });
  it("clears an optional address and returns the persisted client", async () => {
    const userAgent = await registerAndLogin();
    const client = await createTestClient(userAgent);

    const editResponse = await userAgent
      .patch(`/clients/${client.id}`)
      .send({ address: null });
    const getResponse = await userAgent.get(`/clients/${client.id}`);

    expect(editResponse.status).toBe(200);
    expect(editResponse.body).toEqual(getResponse.body);
    expect((editResponse.body as { address: string | null }).address).toBeNull();
  });
  it("leaves omitted client fields unchanged", async () => {
    const userAgent = await registerAndLogin();
    const client = await createTestClient(userAgent);

    const editResponse = await userAgent
      .patch(`/clients/${client.id}`)
      .send({ name: "Only Name Changed" });

    expect(editResponse.status).toBe(200);
    expect(editResponse.body).toMatchObject({
      name: "Only Name Changed",
      address: client.address,
      contact: client.contact,
    });
  });
  it("rejects clearing required client contact", async () => {
    const userAgent = await registerAndLogin();
    const client = await createTestClient(userAgent);

    const response = await userAgent
      .patch(`/clients/${client.id}`)
      .send({ contact: null });

    expect(response.status).toBe(400);
    const getResponse = await userAgent.get(`/clients/${client.id}`);
    expect(getResponse.body).toMatchObject(client);
  });
  it("should not edit another user's client", async () => {
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
      .patch(`/clients/${response.id}`)
      .send(updatedClient);
    expect(editResponse.status).toBe(404);
    expect(editResponse.body).toHaveProperty("message");
  });
  it("should not not edit client without any field", async () => {
    const userAgent = await registerAndLogin();
    const response = await createTestClient(userAgent);

    const editResponse = await userAgent.patch(`/clients/${response.id}`);
    expect(editResponse.status).toBe(400);
    expect(editResponse.body).toMatchObject({
      message: "At least one field is required for editing client",
    });
  });
  it("should get client by id", async () => {
    const userAgent = await registerAndLogin();
    const client = await createTestClient(userAgent);

    const getResponse = await userAgent.get(`/clients/${client.id}`);
    expect(getResponse.status).toBe(200);
    expect(getResponse.body).toMatchObject(client);
  });
  it("should not get client with non uuid parameter", async () => {
    const userAgent = await registerAndLogin();

    const getResponse = await userAgent.get(`/clients/${"asdasd"}`);
    expect(getResponse.status).toBe(400);
    expect(getResponse.body).toMatchObject({
      message: "Client ID is required",
    });
  });
  it("should get client list", async () => {
    const userAgent = await registerAndLogin();
    const client = await createTestClient(userAgent);
    const expected = {
      totalPages: 1,
      clients: [client],
    };

    const getResponse = await userAgent.get(`/clients`);
    expect(getResponse.body).toMatchObject(expected);
    expect(getResponse.status).toBe(200);
  });
});

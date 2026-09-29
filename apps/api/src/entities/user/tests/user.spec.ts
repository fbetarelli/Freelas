import { describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "../../../../app.ts";
import { UserDAO } from "../dao.ts";
import bcrypt from "bcrypt";
const dao = new UserDAO();

describe("User Authentication E2E", () => {
  const agent = request.agent(app);

  it("should register a new user successfully", async () => {
    const response = await agent.post("/register").send({
      login: "a@a.com",
      username: "Test User",
      password: "123",
    });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("login");
  });

  it("should not register a user without required fields", async () => {
    const response = await agent.post("/register").send({
      login: "asd",
      username: "asd",
      password: "asd",
    });
    expect(response.status).toBe(400);
    expect(response.body as { message: string }).toMatchObject({
      message: "Login is required",
    });
  });
  it("should not register a user with an existing login", async () => {
    await dao.register({
      hashPassword: await bcrypt.hash("123", 10),
      login: "a@a.com",
      username: "Test User",
    });

    const response = await agent.post("/register").send({
      login: "a@a.com",
      username: "Test User",
      password: "123",
    });
    expect(response.status).toBe(409);
  });

  it("should logout successfully", async () => {
    const response = await agent.post("/logout");
    expect(response.status).toBe(200);
  });

  it("should login successfully", async () => {
    await dao.register({
      hashPassword: await bcrypt.hash("123", 10),
      login: "a@a.com",
      username: "Test User",
    });

    const response = await agent.post("/login").send({
      login: "a@a.com",
      password: "123",
    });
    expect(response.body).toHaveProperty("login");
    expect(response.status).toBe(200);
  });

  it("should not login with incorrect credentials", async () => {
    const response = await agent.post("/login").send({
      login: "b@b.com",
      password: "wrongpassword",
    });
    expect(response.status).toBe(400);
  });
  it("should not login without required fields", async () => {
    const response = await agent.post("/login").send({
      login: "a@a.com",
      // password: "missingPassword",
    });
    expect(response.status).toBe(400);
    expect(response.body as { message: string }).toMatchObject({
      message: "Password is required",
    });
  });

  it("should edit user details successfully", async () => {
    await agent.post("/register").send({
      login: "a@a.com",
      username: "Test User",
      password: "123",
    });

    const response = await agent.patch("/edit-user").send({
      login: "b@b.com",
      username: "Updated User",
      password: "456",
    });
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      login: "b@b.com",
      username: "Updated User",
    });
  });
  it("should not edit user details without any field", async () => {
    await agent.post("/register").send({
      login: "a@a.com",
      username: "Test User",
      password: "123",
    });

    const response = await agent.patch("/edit-user");
    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({
      message: "At least one field is required for editing user",
    });
  });
});

import { describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "../../../../app.ts";
import { UserDAO } from "../dao.ts";
import bcrypt from "bcrypt";
import { registerAndLogin } from "../../../../tests/utils/setup-helpers.ts";
import * as jwt from "jsonwebtoken";
import { getAuthConfig } from "../../../features/auth/config.ts";
import {
  LogoutResponseZodSchema,
  UserResponseZodSchema,
} from "@freelancemanager/shared";
const dao = new UserDAO();

describe("User Authentication E2E", () => {
  const agent = request.agent(app);
  const authConfig = getAuthConfig();

  const createToken = (
    payload: object = { id: "test-user-id" },
    options: jwt.SignOptions = {},
  ) =>
    jwt.sign(payload, authConfig.ACCESS_TOKEN_SECRET, {
      issuer: authConfig.JWT_ISSUER,
      audience: authConfig.JWT_AUDIENCE,
      ...options,
    });

  it("should register a new user successfully", async () => {
    const response = await agent.post("/register").send({
      login: "a@a.com",
      username: "Test User",
      password: "123",
    });
    expect(response.status).toBe(201);
    UserResponseZodSchema.parse(response.body);
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
  it("enforces unique login at the DAO boundary", async () => {
    await dao.register({
      hashPassword: await bcrypt.hash("123", 10),
      login: "indexed@a.com",
      username: "Indexed User",
    });

    await expect(
      dao.register({
        hashPassword: await bcrypt.hash("123", 10),
        login: "indexed@a.com",
        username: "Second User",
      }),
    ).rejects.toMatchObject({ code: "23505" });
  });
  it("rejects duplicate login updates", async () => {
    const first = await agent.post("/register").send({
      login: "first@a.com",
      username: "First User",
      password: "123",
    });
    await agent.post("/logout");
    await agent.post("/register").send({
      login: "second@a.com",
      username: "Second User",
      password: "123",
    });

    const response = await agent.patch("/edit-user").send({
      login: "first@a.com",
    });

    expect(first.status).toBe(201);
    expect(response.status).toBe(409);
  });
  it("trims identity fields but preserves password whitespace", async () => {
    const response = await agent.post("/register").send({
      login: "  spaced@a.com  ",
      username: "  Spaced User  ",
      password: " 123 ",
    });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      login: "spaced@a.com",
      username: "Spaced User",
    });

    const loginResponse = await agent.post("/login").send({
      login: "spaced@a.com",
      password: " 123 ",
    });
    expect(loginResponse.status).toBe(200);
  });

  it("should logout successfully", async () => {
    const response = await agent.post("/logout");
    LogoutResponseZodSchema.parse(response.text);
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
    UserResponseZodSchema.parse(response.body);
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
  it("should return expected user in /me", async () => {
    const userAgent = await registerAndLogin();
    const response = await userAgent.get("/me");
    expect(response.status).toBe(200);
    UserResponseZodSchema.parse(response.body);
    expect(response.body).toHaveProperty("id");
  });
  it("should return 401 in /me if not authenticated", async () => {
    const userAgent = await registerAndLogin();
    const logoutResponse = await userAgent.post("/logout");
    expect(logoutResponse.status).toBe(200);
    const response = await userAgent.get("/me");
    expect(response.status).toBe(401);
  });
  it("should return 401 in /me for a token with an invalid signing secret", async () => {
    const token = jwt.sign(
      { id: "test-user-id" },
      "invalid-signing-secret",
      {
        issuer: authConfig.JWT_ISSUER,
        audience: authConfig.JWT_AUDIENCE,
      },
    );

    const response = await request(app)
      .get("/me")
      .set("Cookie", `token=${token}`);

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject({
      message: "Invalid or expired login session",
    });
  });
  it("should return 401 in /me when the token cookie is missing", async () => {
    const response = await request(app).get("/me");

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject({
      message: "Authentication required",
    });
  });
  it("should return 401 in /me when the token is missing required claims", async () => {
    const token = createToken({});

    const response = await request(app)
      .get("/me")
      .set("Cookie", `token=${token}`);

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject({
      message: "Invalid login token payload",
    });
  });
  it("should return 401 in /me for an expired token", async () => {
    const token = createToken({ id: "test-user-id" }, { expiresIn: -1 });

    const response = await request(app)
      .get("/me")
      .set("Cookie", `token=${token}`);

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject({
      message: "Invalid or expired login session",
    });
  });
  it("should return 401 in /me for a token with the wrong issuer", async () => {
    const token = createToken(
      { id: "test-user-id" },
      { issuer: "wrong-issuer" },
    );

    const response = await request(app)
      .get("/me")
      .set("Cookie", `token=${token}`);

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject({
      message: "Invalid or expired login session",
    });
  });
  it("should return 401 in /me for a token with the wrong audience", async () => {
    const token = createToken(
      { id: "test-user-id" },
      { audience: "wrong-audience" },
    );

    const response = await request(app)
      .get("/me")
      .set("Cookie", `token=${token}`);

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject({
      message: "Invalid or expired login session",
    });
  });
  it("should return 401 in /me for a garbage token string", async () => {
    const response = await request(app)
      .get("/me")
      .set("Cookie", "token=not-a-jwt");

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject({
      message: "Authentication required",
    });
  });
  it("should return 401 in /me for a token using a non-allowed algorithm", async () => {
    const token = createToken(
      { id: "test-user-id" },
      { algorithm: "HS384" },
    );

    const response = await request(app)
      .get("/me")
      .set("Cookie", `token=${token}`);

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject({
      message: "Invalid or expired login session",
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
    UserResponseZodSchema.parse(response.body);
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
  it("rejects unknown user fields", async () => {
    await agent.post("/register").send({
      login: "unknown-field@a.com",
      username: "Test User",
      password: "123",
    });

    const response = await agent.patch("/edit-user").send({
      username: "Changed User",
      unexpected: true,
    });

    expect(response.status).toBe(400);
  });
});

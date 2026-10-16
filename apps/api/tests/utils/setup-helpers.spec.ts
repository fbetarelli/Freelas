import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "../../app.ts";
import {
  createTestJob,
  makeUser,
  registerAndLogin,
} from "./setup-helpers.ts";

describe("test setup helpers", () => {
  it("throws the failing setup step when creating a job fails", async () => {
    const userAgent = await registerAndLogin();

    await expect(createTestJob(userAgent, "00000000-0000-0000-0000-000000000000"))
      .rejects.toThrow("createTestJob");
  });

  it("registers a fixed login successfully", async () => {
    const response = await request(app).post("/register").send({
      ...makeUser(),
      login: "rollback-check@example.com",
    });

    expect(response.status).toBe(201);
  });

  it("registers the same fixed login after the previous test rolled back", async () => {
    const response = await request(app).post("/register").send({
      ...makeUser(),
      login: "rollback-check@example.com",
    });

    expect(response.status).toBe(201);
  });
});

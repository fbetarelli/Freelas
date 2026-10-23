import express from "express";
import request from "supertest";
import { afterEach, describe, expect, it, vi } from "vitest";
import { errorHandler } from "../errors.ts";

const makeErrorApp = (error: object) => {
  const app = express();
  app.get("/", (_req, _res, next) => next(error));
  errorHandler(app);
  return app;
};

afterEach(() => {
  vi.restoreAllMocks();
});

describe("database error mapping", () => {
  it.each([
    ["22003", 400],
    ["22007", 400],
    ["23503", 400],
    ["23505", 409],
  ])("maps PostgreSQL code %s to status %s without leaking details", async (code, status) => {
    const error = {
      code,
      detail: "secret database detail",
      constraint: "secret_constraint",
      message: "secret server message",
    };
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

    const response = await request(makeErrorApp(error)).get("/");

    expect(response.status).toBe(status);
    const body = response.body as { message: string };
    expect(body.message).not.toContain("secret");
    expect(body.message).not.toContain("constraint");
    expect(consoleError).toHaveBeenCalledWith(error);
  });

  it("uses the generic invalid database value message", async () => {
    const response = await request(
      makeErrorApp({ code: "22003", detail: "numeric overflow" }),
    ).get("/");

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Invalid database value" });
  });

  it("maps unknown PostgreSQL codes to a generic 500", async () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    const error = { code: "99999", detail: "secret", message: "server text" };

    const response = await request(makeErrorApp(error)).get("/");

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: "Internal server error" });
    expect(consoleError).toHaveBeenCalledWith(error);
  });
});

import express, { type Request } from "express";
import request from "supertest";
import { describe, expect, it } from "vitest";
import { errorHandler, UnauthorizedError } from "../../../entities/errors/errors.ts";
import type { AccessTokenPayload } from "../types.ts";
import { requireUser } from "../require-user.ts";

const payload: AccessTokenPayload = {
  id: "00000000-0000-0000-0000-000000000001",
};

describe("requireUser", () => {
  it("returns the authenticated payload", () => {
    expect(requireUser({ user: payload } satisfies Pick<Request, "user">)).toBe(
      payload,
    );
  });

  it("throws an unauthorized error when the request has no user", () => {
    expect(() =>
      requireUser({ user: undefined } satisfies Pick<Request, "user">),
    ).toThrow(UnauthorizedError);
  });

  it("returns 401 when used without authenticate", async () => {
    const app = express();
    app.get("/protected", (req, res) => {
      res.json(requireUser(req));
    });
    errorHandler(app);

    const response = await request(app).get("/protected");

    expect(response.status).toBe(401);
  });
});

import cookieParser from "cookie-parser";
import express from "express";
import * as jwt from "jsonwebtoken";
import request from "supertest";
import { describe, expect, it } from "vitest";
import { errorHandler } from "../../../../entities/errors/errors.ts";
import { getAuthConfig } from "../../config.ts";
import { authenticate } from "../../middlewares/authentication.ts";

const authConfig = getAuthConfig();
const validPayload = { id: "00000000-0000-0000-0000-000000000001" };

function makeToken(
  payload: object = validPayload,
  options: jwt.SignOptions = {},
  secret = authConfig.ACCESS_TOKEN_SECRET,
) {
  return jwt.sign(payload, secret, {
    algorithm: "HS256",
    issuer: authConfig.JWT_ISSUER,
    audience: authConfig.JWT_AUDIENCE,
    ...options,
  });
}

function makeApp() {
  const app = express();
  app.use(cookieParser());
  app.get("/protected", authenticate, (req, res) => {
    res.json(req.user);
  });
  errorHandler(app);
  return app;
}

async function requestWithToken(token: string) {
  return request(makeApp()).get("/protected").set("Cookie", `token=${token}`);
}

async function requestWithoutToken() {
  return request(makeApp()).get("/protected");
}

describe("authenticate JWT verification", () => {
  it("rejects a missing token with 401", async () => {
    const response = await requestWithoutToken();

    expect(response.status).toBe(401);
  });

  it("accepts a valid token with the configured issuer and audience", async () => {
    const response = await requestWithToken(makeToken());

    expect(response.status).toBe(200);
    expect(response.body).toEqual(validPayload);
  });

  it.each([
    ["malformed", "not.a.valid.jwt"],
    ["incorrectly signed", makeToken(validPayload, {}, "wrong signing secret")],
    ["expired", makeToken(validPayload, { expiresIn: -1 })],
    ["wrong issuer", makeToken(validPayload, { issuer: "another-issuer" })],
    ["wrong audience", makeToken(validPayload, { audience: "another-audience" })],
  ])("rejects a %s token with 401", async (_label, token) => {
    const response = await requestWithToken(token);

    expect(response.status).toBe(401);
  });

  it("rejects a correctly signed token with an invalid application payload", async () => {
    const response = await requestWithToken(makeToken({ sub: "no-user-id" }));

    expect(response.status).toBe(401);
  });
});

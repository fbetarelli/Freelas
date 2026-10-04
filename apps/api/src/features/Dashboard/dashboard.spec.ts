import { expect, it, describe } from "vitest";
import {
  createTestClient,
  createTestJob,
  registerAndLogin,
} from "../../../tests/utils/setup-helpers.ts";

describe("Dashboard E2E", () => {
  it("should get dashboard data", async () => {
    const userAgent = await registerAndLogin();
    const client = await createTestClient(userAgent);
    const job = await createTestJob(userAgent, client.id);

    const response = await userAgent.get("/dashboard");

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      clients: [client],
      jobs: [job],
    });
  });
});

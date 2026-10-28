import { expect, it, describe } from "vitest";
import { DashboardResponseZodSchema } from "@freelancemanager/shared";
import {
  createTestClient,
  createTestJob,
  createTestMaterial,
  createTestPayment,
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
    DashboardResponseZodSchema.parse(response.body);
  });
  it("calculates exact SQL profit from payments and materials", async () => {
    const userAgent = await registerAndLogin();
    const client = await createTestClient(userAgent);
    const job = await createTestJob(userAgent, client.id);
    await userAgent
      .patch(`/jobs/${job.id}`)
      .send({ jobDate: new Date().toISOString().slice(0, 10) });
    await createTestPayment(userAgent, job.id, {
      value: 0.3,
      paymentDate: "2023-06-01",
      method: "Cash",
      installment: 1,
    });
    await createTestMaterial(userAgent, job.id, {
      descr: "Small material",
      supplier: null,
      qnt: 1,
      unitaryVal: 0.1,
    });

    const response = await userAgent.get("/dashboard");

    expect(response.status).toBe(200);
    expect((response.body as { profit: string }).profit).toBe("0,20");
  });

  it("accepts negative formatted profit in the dashboard response", async () => {
    const userAgent = await registerAndLogin();
    const client = await createTestClient(userAgent);
    const job = await createTestJob(userAgent, client.id);
    await userAgent
      .patch(`/jobs/${job.id}`)
      .send({ jobDate: new Date().toISOString().slice(0, 10) });
    await createTestPayment(userAgent, job.id, {
      value: 0.1,
      paymentDate: "2023-06-01",
      method: "Cash",
      installment: 1,
    });
    await createTestMaterial(userAgent, job.id, {
      descr: "Material exceeds payment",
      supplier: null,
      qnt: 1,
      unitaryVal: 0.3,
    });

    const response = await userAgent.get("/dashboard");

    expect(response.status).toBe(200);
    const dashboard = DashboardResponseZodSchema.parse(response.body);
    expect(dashboard.profit).toBe("-0,20");
  });
});

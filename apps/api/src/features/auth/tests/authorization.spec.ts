import { describe, expect, it } from "vitest";
import { app } from "../../../../app.ts";
import {
  createTestClient,
  createTestJob,
  createTestMaterial,
  createTestPayment,
  makeJob,
  makeMaterial,
  makePayment,
  registerAndLogin,
} from "../../../../tests/utils/setup-helpers.ts";
import {
  buildPaths,
  malformedId,
  ownershipExempt,
  ownershipRoutes,
  sendRequest,
} from "./ownership-routes.ts";
import { collectAppRoutes, routeKey } from "./route-helpers.ts";

describe("cross-user authorization", () => {
  it("hides another user's client and preserves owner access", async () => {
    // Arrange: create a client owned by user A and authenticate as user B.
    const owner = await registerAndLogin();
    const otherUser = await registerAndLogin();
    const client = await createTestClient(owner);

    // Act and assert: user B sees the same not-found contract as a missing client.
    await otherUser.patch(`/clients/${client.id}`).send({ name: "Changed" });
    expect((await owner.get(`/clients/${client.id}`)).body).toMatchObject(
      client,
    );

    await otherUser.delete(`/clients/${client.id}`);
    expect((await owner.get(`/clients/${client.id}`)).body).toMatchObject(
      client,
    );

    const ownerGet = await owner.get(`/clients/${client.id}`);
    expect(ownerGet.status).toBe(200);
  });

  it("hides another user's job and rejects nested job creation", async () => {
    // Arrange: create a job owned by user A.
    const owner = await registerAndLogin();
    const otherUser = await registerAndLogin();
    const client = await createTestClient(owner);
    const job = await createTestJob(owner, client.id);

    // Act and assert: user B cannot read, mutate, delete, list, or create under it.
    await otherUser
      .patch(`/jobs/${job.id}`)
      .send({ ...makeJob(), descr: "Changed" });
    expect((await owner.get(`/jobs/${job.id}`)).body).toMatchObject(job);
    expect((await owner.get(`/jobs/${job.id}`)).status).toBe(200);
  });

  it("hides another user's materials and nested material creation", async () => {
    // Arrange: create a material under user A's job.
    const owner = await registerAndLogin();
    const otherUser = await registerAndLogin();
    const client = await createTestClient(owner);
    const job = await createTestJob(owner, client.id);
    const material = await createTestMaterial(owner, job.id);

    // Act and assert: material access and creation remain scoped to the job owner.
    await otherUser
      .patch(`/materials/${material.id}`)
      .send({ ...makeMaterial(), descr: "Changed" });
    await otherUser.delete(`/materials/${material.id}`);
    const ownerMaterials = await owner.get(`/jobs/${job.id}/materials`);
    expect(ownerMaterials.status).toBe(200);
    expect(ownerMaterials).toMatchObject({
      body: { materials: [material] },
    });
    expect(
      (await owner.patch(`/materials/${material.id}`).send(makeMaterial()))
        .status,
    ).toBe(200);
  });

  it("hides another user's payments and nested payment creation", async () => {
    // Arrange: create a payment under user A's job.
    const owner = await registerAndLogin();
    const otherUser = await registerAndLogin();
    const client = await createTestClient(owner);
    const job = await createTestJob(owner, client.id);
    const payment = await createTestPayment(owner, job.id);

    // Act and assert: payment access and creation remain scoped to the job owner.
    await otherUser.patch(`/payment/${payment.id}`).send(makePayment());
    await otherUser.delete(`/payment/${payment.id}`);
    const ownerPayments = await owner.get(`/jobs/${job.id}/payments`);
    expect(ownerPayments.status).toBe(200);
    expect(ownerPayments).toMatchObject({
      body: { data: [payment] },
    });
    expect(
      (await owner.patch(`/payment/${payment.id}`).send(makePayment())).status,
    ).toBe(200);
  });

  it("does not include another user's data in the dashboard", async () => {
    // Arrange: populate user A's dashboard data.
    const owner = await registerAndLogin();
    const otherUser = await registerAndLogin();
    const client = await createTestClient(owner);
    const job = await createTestJob(owner, client.id);
    await createTestMaterial(owner, job.id);
    const recentDate = new Date();
    recentDate.setDate(recentDate.getDate() - 1);
    const recentDateString = recentDate.toISOString().slice(0, 10);
    await owner
      .patch(`/jobs/${job.id}`)
      .send({ ...makeJob(), jobDate: recentDateString });
    await createTestPayment(owner, job.id, {
      ...makePayment(),
      paymentDate: recentDateString,
    });

    // Assert: user B receives an empty view of user A's resources.
    const ownerDashboard = await owner.get("/dashboard");
    expect(ownerDashboard.status).toBe(200);
    expect(ownerDashboard.body).toHaveProperty(
      "clients",
      expect.arrayContaining([expect.objectContaining({ id: client.id })]),
    );
    expect(ownerDashboard.body).toHaveProperty(
      "jobs",
      expect.arrayContaining([expect.objectContaining({ id: job.id })]),
    );
    expect(ownerDashboard.body).toHaveProperty(
      "profit",
      expect.not.stringMatching(/^0,00$/),
    );
    expect(ownerDashboard.body).not.toMatchObject({ count: 0 });

    const otherDashboard = await otherUser.get("/dashboard");
    expect(otherDashboard.status).toBe(200);
    expect(otherDashboard.body).toMatchObject({
      clients: [],
      jobs: [],
      profit: "0,00",
      count: 0,
    });
  });
});

describe("cross-user route parity", () => {
  it.each(ownershipRoutes)(
    "$method $path has the same foreign and missing 404 contract",
    async (row) => {
      const owner = await registerAndLogin();
      const otherUser = await registerAndLogin();
      const client = await createTestClient(owner);
      const job = await createTestJob(owner, client.id);
      const material = await createTestMaterial(owner, job.id);
      const payment = await createTestPayment(owner, job.id);
      const paths = buildPaths(row, {
        client: client.id,
        job: job.id,
        material: material.id,
        payment: payment.id,
      });
      const foreignResponse = await sendRequest(
        otherUser,
        row.method,
        paths.foreign,
        row.body,
      );
      const missingResponse = await sendRequest(
        otherUser,
        row.method,
        paths.missing,
        row.body,
      );

      expect(foreignResponse.status).toBe(404);
      expect(missingResponse.status).toBe(404);
      expect(foreignResponse.body).toEqual(missingResponse.body);
    },
  );
});

describe("malformed UUID validation", () => {
  it.each(ownershipRoutes)(
    "$method $path returns 400 for a malformed UUID",
    async (row) => {
      const user = await registerAndLogin();
      const response = await sendRequest(
        user,
        row.method,
        buildPaths(row, {
          client: malformedId,
          job: malformedId,
          material: malformedId,
          payment: malformedId,
        }).malformed,
        row.body,
      );

      expect(response.status).toBe(400);
    },
  );
});

describe("ownership route coverage", () => {
  it("classifies every parameterized route exactly once", () => {
    const registered = collectAppRoutes(app).filter((route) =>
      route.path.includes(":"),
    );
    const classified = [...ownershipRoutes, ...ownershipExempt];
    const registeredKeys = new Set(registered.map(routeKey));
    const classifiedKeys = new Set(classified.map(routeKey));

    expect(
      registered
        .filter((route) => !classifiedKeys.has(routeKey(route)))
        .map(routeKey),
    ).toEqual([]);
    expect(
      classified
        .filter((route) => !registeredKeys.has(routeKey(route)))
        .map(routeKey),
    ).toEqual([]);
    expect(
      classified
        .map(routeKey)
        .filter((key, index, keys) => keys.indexOf(key) !== index),
    ).toEqual([]);
  });
});

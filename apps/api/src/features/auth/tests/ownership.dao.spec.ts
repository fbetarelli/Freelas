import { describe, expect, it } from "vitest";
import { ClientDAO } from "../../../entities/client/dao.ts";
import { JobDAO } from "../../../entities/job/dao.ts";
import { MaterialDAO } from "../../../entities/material/dao.ts";
import { PaymentDAO } from "../../../entities/payment/dao.ts";
import {
  createTestClient,
  createTestJob,
  createTestMaterial,
  createTestPayment,
  registerAndLogin,
} from "../../../../tests/utils/setup-helpers.ts";

const getUserId = async (
  agent: Awaited<ReturnType<typeof registerAndLogin>>,
) => {
  const body: unknown = (await agent.get("/me")).body;
  if (
    typeof body !== "object" ||
    body === null ||
    !("id" in body) ||
    typeof body.id !== "string"
  ) {
    throw new Error("Expected /me to return a user id");
  }
  return body.id;
};

describe("ownership-aware DAOs", () => {
  it("scopes client reads, edits, and deletes to the owner", async () => {
    // Arrange: create a client as user A and identify both users.
    const owner = await registerAndLogin();
    const otherUser = await registerAndLogin();
    const ownerId = await getUserId(owner);
    const otherUserId = await getUserId(otherUser);
    const client = await createTestClient(owner);
    const dao = new ClientDAO();

    // Assert: user B cannot read, update, or delete user A's client.
    expect(await dao.getClientById(client.id, otherUserId)).toBeNull();
    expect(
      await dao.editClient({ id: client.id, name: "Other" }, otherUserId),
    ).toBeNull();
    expect(await dao.deleteClient(client.id, otherUserId)).toBe(false);
    // Assert: the owner can still read the client.
    expect((await dao.getClientById(client.id, ownerId))?.id).toBe(client.id);
  });

  it("scopes job reads, edits, and deletes to the owner", async () => {
    // Arrange: create a job as user A and identify both users.
    const owner = await registerAndLogin();
    const otherUser = await registerAndLogin();
    const ownerId = await getUserId(owner);
    const otherUserId = await getUserId(otherUser);
    const client = await createTestClient(owner);
    const job = await createTestJob(owner, client.id);
    const dao = new JobDAO();

    // Assert: direct and nested job operations require the owning user.
    expect(await dao.getJobById(job.id, otherUserId)).toBeNull();
    expect(
      await dao.editJob({ id: job.id, descr: "Other" }, otherUserId),
    ).toBeNull();
    expect(await dao.deleteJob(job.id, otherUserId)).toBe(false);
    expect((await dao.getJobById(job.id, ownerId))?.id).toBe(job.id);
    expect(await dao.getJobsByClient(client.id, ownerId)).not.toBeNull();
    expect(await dao.getJobsByClient(client.id, otherUserId)).toBeNull();
  });

  it("does not create a job under another user's client", async () => {
    const owner = await registerAndLogin();
    const otherUser = await registerAndLogin();
    const client = await createTestClient(owner);
    const userId = await getUserId(otherUser);
    const dao = new JobDAO();

    expect(
      await dao.addJob({
        descr: "Other user's job",
        jobDate: "2023-06-01",
        payed: false,
        totalValue: 100,
        clientId: client.id,
        userId,
      }),
    ).toBeNull();
  });

  it("scopes material reads, edits, deletes, and creation to the job owner", async () => {
    // Arrange: create a material under user A's job.
    const owner = await registerAndLogin();
    const otherUser = await registerAndLogin();
    const otherUserId = await getUserId(otherUser);
    const client = await createTestClient(owner);
    const job = await createTestJob(owner, client.id);
    const material = await createTestMaterial(owner, job.id);
    const dao = new MaterialDAO();

    // Assert: user B cannot access or create materials through that job.
    expect(await dao.getMaterialsByJob(job.id, otherUserId)).toBeNull();
    expect(
      await dao.editMaterial({ id: material.id, descr: "Other" }, otherUserId),
    ).toBeNull();
    expect(await dao.deleteMaterial(material.id, otherUserId)).toBe(false);
    expect(
      await dao.addMaterial(
        {
          descr: material.descr,
          supplier: material.supplier,
          qnt: material.qnt,
          unitaryVal: 1,
          jobId: material.jobId,
        },
        otherUserId,
      ),
    ).toBeNull();
  });

  it("scopes payment reads, edits, deletes, and creation to the job owner", async () => {
    // Arrange: create a payment under user A's job.
    const owner = await registerAndLogin();
    const otherUser = await registerAndLogin();
    const otherUserId = await getUserId(otherUser);
    const client = await createTestClient(owner);
    const job = await createTestJob(owner, client.id);
    const payment = await createTestPayment(owner, job.id);
    const dao = new PaymentDAO();

    // Assert: user B cannot access or create payments through that job.
    expect(await dao.getPaymentsByJob(job.id, otherUserId)).toBeNull();
    expect(
      await dao.editPayment({ id: payment.id, method: "Other" }, otherUserId),
    ).toBeNull();
    expect(await dao.deletePayment(payment.id, otherUserId)).toBe(false);
    expect(
      await dao.addPayment(
        {
          method: payment.method,
          paymentDate: payment.paymentDate,
          value: 1,
          installment: payment.installment,
          jobId: payment.jobId,
        },
        otherUserId,
      ),
    ).toBeNull();
  });
});

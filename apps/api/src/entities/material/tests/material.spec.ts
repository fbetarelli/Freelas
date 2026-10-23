import { describe, expect, it } from "vitest";
import {
  createTestMaterial,
  makeMaterial,
  setupJob,
} from "../../../../tests/utils/setup-helpers.ts";
import { formatValueToString } from "../../../utils/formatting-helpers.ts";
import type { FormattedMaterial } from "../types.ts";

const getExpectedMaterial = (material: {
  descr: string;
  supplier: string | null;
  qnt: number;
  unitaryVal: number;
}) => {
  return {
    ...material,
    unitaryVal: formatValueToString(material.unitaryVal),
    totalVal: formatValueToString(material.unitaryVal * material.qnt),
  };
};

describe("Material E2E", () => {
  it("should create a material", async () => {
    const { userAgent, jobId } = await setupJob();
    const material = makeMaterial();

    const response = await userAgent
      .post(`/jobs/${jobId}/materials`)
      .send(material);
    expect(response.status).toBe(201);
    expect(response.body).toMatchObject(getExpectedMaterial(material));
  });
  it("should not create a material with invalid data", async () => {
    const { userAgent, jobId } = await setupJob();

    const response = await userAgent.post(`/jobs/${jobId}/materials`).send({
      // descr: "Test Material", missing description
      supplier: "Test Supplier",
      qnt: -10, // invalid quantity
      unitaryVal: 100.0,
    });
    expect(response.status).toBe(400);
  });
  it("persists a null supplier on create and edit", async () => {
    const { userAgent, jobId } = await setupJob();
    const createResponse = await userAgent
      .post(`/jobs/${jobId}/materials`)
      .send({ ...makeMaterial(), supplier: null });
    const created = createResponse.body as { id: string; supplier: string | null };

    expect(createResponse.status).toBe(201);
    expect(created.supplier).toBeNull();

    const editResponse = await userAgent
      .patch(`/materials/${created.id}`)
      .send({ supplier: "Updated Supplier" });
    expect(editResponse.status).toBe(200);
    expect((editResponse.body as { supplier: string | null }).supplier).toBe(
      "Updated Supplier",
    );
    const clearResponse = await userAgent
      .patch(`/materials/${created.id}`)
      .send({ supplier: null });
    expect(clearResponse.status).toBe(200);
    expect((clearResponse.body as { supplier: string | null }).supplier).toBeNull();
    const getResponse = await userAgent.get(`/jobs/${jobId}/materials`);
    const materials = getResponse.body as {
      materials: Array<{ supplier: string | null }>;
    };
    expect(materials.materials[0].supplier).toBeNull();
  });
  it.each(["descr", "qnt", "unitaryVal"])(
    "rejects null required material field: %s",
    async (field) => {
      const { userAgent, jobId } = await setupJob();
      const material = await createTestMaterial(userAgent, jobId);
      const response = await userAgent
        .patch(`/materials/${material.id}`)
        .send({ [field]: null });

      expect(response.status).toBe(400);
      const getResponse = await userAgent.get(`/jobs/${jobId}/materials`);
      const materials = getResponse.body as {
        materials: unknown[];
      };
      expect(materials.materials[0]).toMatchObject(material);
    },
  );
  it("rejects an unknown material field", async () => {
    const { userAgent, jobId } = await setupJob();
    const material = await createTestMaterial(userAgent, jobId);

    const response = await userAgent
      .patch(`/materials/${material.id}`)
      .send({ descr: "Changed", unexpected: true });

    expect(response.status).toBe(400);
  });
  it("rejects an empty material patch", async () => {
    const { userAgent, jobId } = await setupJob();
    const material = await createTestMaterial(userAgent, jobId);

    const response = await userAgent
      .patch(`/materials/${material.id}`)
      .send({});

    expect(response.status).toBe(400);
  });
  it("should edit a material", async () => {
    const { userAgent, jobId } = await setupJob();

    const { id: materialId } = await createTestMaterial(userAgent, jobId);

    const editResponse = await userAgent
      .patch(`/materials/${materialId}`)
      .send({
        descr: "Updated Test Material",
        supplier: "Updated Test Supplier",
        qnt: 20,
        unitaryVal: 200.0,
      });

    expect(editResponse.status).toBe(200);
    expect(editResponse.body).toMatchObject(
      getExpectedMaterial({
        descr: "Updated Test Material",
        supplier: "Updated Test Supplier",
        qnt: 20,
        unitaryVal: 200.0,
      }),
    );
  });
  it("should delete a material", async () => {
    const { userAgent, jobId } = await setupJob();
    const material = makeMaterial();

    const createResponse: { body: { id: string } } = await userAgent
      .post(`/jobs/${jobId}/materials`)
      .send(material);
    const materialId = createResponse.body.id;

    const deleteResponse = await userAgent.delete(`/materials/${materialId}`);

    expect(deleteResponse.status).toBe(204);
  });
  it("should get materials by job", async () => {
    const { userAgent, jobId } = await setupJob();
    const materials = [makeMaterial(), makeMaterial(), makeMaterial()];

    for (const material of materials) {
      await userAgent.post(`/jobs/${jobId}/materials`).send(material);
    }

    const response = await userAgent.get(`/jobs/${jobId}/materials`);
    const responseBody = response.body as { materials: FormattedMaterial[] };
    expect(response.status).toBe(200);
    expect(responseBody.materials).toHaveLength(3);
  });
  it("calculates material totals in SQL without floating-point drift", async () => {
    const { userAgent, jobId } = await setupJob();
    await createTestMaterial(userAgent, jobId, { ...makeMaterial(), qnt: 1, unitaryVal: 0.1 });
    await createTestMaterial(userAgent, jobId, { ...makeMaterial(), qnt: 1, unitaryVal: 0.2 });

    const response = await userAgent.get(`/jobs/${jobId}/materials`);

    expect(response.status).toBe(200);
    expect((response.body as { totalValue: number }).totalValue).toBe(0.3);
  });
  it("should not get materials by an invalid job ID", async () => {
    const { userAgent } = await setupJob();

    const response = await userAgent.get(`/jobs/${123}/materials`);
    expect(response.status).toBe(400);
  });
});

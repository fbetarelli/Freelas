import { describe, expect, it } from "vitest";
import {
  createTestMaterial,
  setupJob,
  testMaterial
} from "../../../../tests/utils/setup-helpers.ts";
import { formatValueToString } from "../../../utils/formatting-helpers.ts";
import type { FormattedMaterial } from "../types.ts";

const getExpectedMaterial = (material: {
  descr: string;
  supplier: string;
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

    const response = await userAgent.post(`/jobs/${jobId}/materials`).send({
      descr: "Test Material",
      supplier: "Test Supplier",
      qnt: 10,
      unitaryVal: 100.0,
    });
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject(getExpectedMaterial(testMaterial));
  });
  it("should edit a material", async () => {
    const { userAgent, jobId } = await setupJob();

    const {id: materialId}= await createTestMaterial(userAgent, jobId);

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

    const createResponse: { body: { id: string } } = await userAgent
      .post(`/jobs/${jobId}/materials`)
      .send(testMaterial);
    const materialId = createResponse.body.id;

    const deleteResponse = await userAgent
      .delete(`/materials/${materialId}`)

    expect(deleteResponse.status).toBe(204);
  });
  it("should get materials by job", async () => {
    const { userAgent, jobId } = await setupJob();
    await createTestMaterial(userAgent, jobId);
    await createTestMaterial(userAgent, jobId);
    await createTestMaterial(userAgent, jobId);

    const response = await userAgent.get(`/jobs/${jobId}/materials`);
    const responseBody = response.body as { materials: FormattedMaterial[] };
    expect(response.status).toBe(200);
    expect(responseBody.materials).toHaveLength(3);
  });
});

import { describe, expect, it } from "vitest";
import {
  createTestPayment,
  setupJob,
  testPayment,
} from "../../../../tests/utils/setup-helpers.ts";
import { formatValueToString } from "../../../utils/formatting-helpers.ts";

const getExpectedPayment = (payment: {
  paymentDate: string;
  value: number;
  method: string;
  installment: number;
}): {
  paymentDate: string;
  value: string;
  method: string;
  installment: number;
} => {
  return {
    paymentDate: payment.paymentDate.split("-").reverse().join("/"),
    value: formatValueToString(payment.value),
    method: payment.method,
    installment: payment.installment,
  };
};

describe("Payment E2E", () => {
  it("should add a payment", async () => {
    const { userAgent, jobId } = await setupJob();
    const response = await userAgent
      .post(`/jobs/${jobId}/payments`)
      .send(testPayment);
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject(getExpectedPayment(testPayment));
  });
  it("should edit a payment", async () => {
    const { userAgent, jobId } = await setupJob();
    const { id: paymentId } = await createTestPayment(userAgent, jobId);

    const expected = {
      value: 200.0,
      paymentDate: "2023-06-02",
      method: "Debit Card",
      installment: 2,
    };

    const response = await userAgent
      .patch(`/payment/${paymentId}`)
      .send(expected);
    expect(response.body).toMatchObject(getExpectedPayment(expected));
    expect(response.status).toBe(200);
  });
  it("should delete a payment", async () => {
    const { userAgent, jobId } = await setupJob();
    const { id: paymentId } = await createTestPayment(userAgent, jobId);

    const response = await userAgent.delete(`/payment/${paymentId}`);

    expect(response.status).toBe(204);
  });
  it("should get a job's payments", async () => {
    const { userAgent, jobId } = await setupJob();
    await createTestPayment(userAgent, jobId);
    await createTestPayment(userAgent, jobId);
    await createTestPayment(userAgent, jobId);

    const response = await userAgent.get(`/jobs/${jobId}/payments`);
    const body = response.body as { data: unknown[]; totalValue: number };

    const expected = getExpectedPayment(testPayment);

    expect(response.status).toBe(200);
    expect(body.data).toHaveLength(3);
    expect(body.data[0]).toMatchObject(expected);
  });
});

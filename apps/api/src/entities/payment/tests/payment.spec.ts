import { describe, expect, it } from "vitest";
import {
  PaymentListResponseZodSchema,
  PaymentResponseZodSchema,
} from "@freelancemanager/shared";
import {
  createTestPayment,
  makePayment,
  setupJob,
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
    const payment = makePayment();
    const response = await userAgent
      .post(`/jobs/${jobId}/payments`)
      .send(payment);
    expect(response.status).toBe(201);
    PaymentResponseZodSchema.parse(response.body);
    expect(response.body).toMatchObject(getExpectedPayment(payment));
  });
  it("should not add payment with invalid data", async () => {
    const { userAgent, jobId } = await setupJob();
    const response = await userAgent.post(`/jobs/${jobId}/payments`).send({
      ...makePayment(),
      description: 123, // Invalid type for description
      value: -100, // Invalid value (negative)
    });
    expect(response.status).toBe(400);
  });
  it.each(["paymentDate", "method", "value", "installment"])(
    "rejects null required payment field: %s",
    async (field) => {
      const { userAgent, jobId } = await setupJob();
      const response = await userAgent
        .post(`/jobs/${jobId}/payments`)
        .send({ ...makePayment(), [field]: null });

      expect(response.status).toBe(400);
    },
  );
  it("rejects an unknown payment field", async () => {
    const { userAgent, jobId } = await setupJob();
    const payment = await createTestPayment(userAgent, jobId);

    const response = await userAgent
      .patch(`/payment/${payment.id}`)
      .send({ method: "Changed", unexpected: true });

    expect(response.status).toBe(400);
  });
  it("rejects an empty payment patch", async () => {
    const { userAgent, jobId } = await setupJob();
    const payment = await createTestPayment(userAgent, jobId);

    const response = await userAgent
      .patch(`/payment/${payment.id}`)
      .send({});

    expect(response.status).toBe(400);
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
    PaymentResponseZodSchema.parse(response.body);
  });
  it.each(["paymentDate", "method", "value", "installment"])(
    "rejects clearing required payment field: %s",
    async (field) => {
      const { userAgent, jobId } = await setupJob();
      const payment = await createTestPayment(userAgent, jobId);
      const response = await userAgent
        .patch(`/payment/${payment.id}`)
        .send({ [field]: null });

      expect(response.status).toBe(400);
      const getResponse = await userAgent.get(`/jobs/${jobId}/payments`);
      const payments = getResponse.body as {
        data: unknown[];
      };
      expect(payments.data[0]).toMatchObject(payment);
    },
  );
  it("should delete a payment", async () => {
    const { userAgent, jobId } = await setupJob();
    const { id: paymentId } = await createTestPayment(userAgent, jobId);

    const response = await userAgent.delete(`/payment/${paymentId}`);

    expect(response.status).toBe(204);
  });
  it("should get a job's payments", async () => {
    const { userAgent, jobId } = await setupJob();
    const payment = makePayment();
    await createTestPayment(userAgent, jobId, payment);
    await createTestPayment(userAgent, jobId);
    await createTestPayment(userAgent, jobId);

    const response = await userAgent.get(`/jobs/${jobId}/payments`);
    const body = response.body as { data: unknown[]; totalValue: number };

    const expected = getExpectedPayment(payment);

    expect(response.status).toBe(200);
    PaymentListResponseZodSchema.parse(response.body);
    expect(body.data).toHaveLength(3);
    expect(body.data[0]).toMatchObject(expected);
  });
  it("calculates payment totals in SQL without floating-point drift", async () => {
    const { userAgent, jobId } = await setupJob();
    await createTestPayment(userAgent, jobId, { ...makePayment(), value: 0.1 });
    await createTestPayment(userAgent, jobId, { ...makePayment(), value: 0.2 });

    const response = await userAgent.get(`/jobs/${jobId}/payments`);

    expect(response.status).toBe(200);
    expect((response.body as { totalValue: number }).totalValue).toBe(0.3);
  });
  it("should not get a job's payments with an invalid job ID", async () => {
    const { userAgent } = await setupJob();
    const response = await userAgent.get(`/jobs/${123}/payments`);

    expect(response.status).toBe(400);
  });
});

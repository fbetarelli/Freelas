import { describe, expect, it } from "vitest";
import {
  EditJobZodSchema,
  EditMaterialZodSchema,
  EditPaymentZodSchema,
  JobZodSchema,
  MaterialZodSchema,
  RegisterJobZodSchema,
  RegisterMaterialZodSchema,
  RegisterPaymentZodSchema,
  moneySchema,
} from "@freelancemanager/shared";

describe("shared money schemas", () => {
  it.each([0.01, 99999.99])("accepts money boundary %s", (value) => {
    expect(moneySchema.safeParse(value).success).toBe(true);
  });

  it.each([0, 0.009, 100000, 1.234, NaN, Infinity, -Infinity])(
    "rejects invalid money value %s",
    (value) => {
      expect(moneySchema.safeParse(value).success).toBe(false);
    },
  );

  it("uses the shared money schema for all money-bearing fields", () => {
    expect(RegisterJobZodSchema.shape.totalValue).toBe(
      RegisterMaterialZodSchema.shape.unitaryVal,
    );
    expect(RegisterJobZodSchema.shape.totalValue).toBe(
      RegisterPaymentZodSchema.shape.value,
    );
    expect(JobZodSchema.shape.totalValue).toBe(
      MaterialZodSchema.shape.unitaryVal,
    );
    expect(RegisterPaymentZodSchema.shape.value).toBe(
      MaterialZodSchema.shape.unitaryVal,
    );
    expect(EditJobZodSchema.shape.totalValue).toBeDefined();
    expect(EditMaterialZodSchema.shape.unitaryVal).toBeDefined();
    expect(EditPaymentZodSchema.shape.value).toBeDefined();
  });

  it("accepts job totals below one while keeping quantity and installments positive", () => {
    expect(
      RegisterJobZodSchema.safeParse({
        jobDate: "2023-06-01",
        descr: "Small job",
        payed: false,
        totalValue: 0.01,
      }).success,
    ).toBe(true);
    expect(
      RegisterMaterialZodSchema.safeParse({
        descr: "Material",
        supplier: null,
        qnt: 0,
        unitaryVal: 1,
      }).success,
    ).toBe(false);
    expect(
      RegisterPaymentZodSchema.safeParse({
        method: "Cash",
        paymentDate: "2023-06-01",
        value: 1,
        installment: 0,
      }).success,
    ).toBe(false);
  });
});

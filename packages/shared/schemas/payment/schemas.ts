import { z } from "zod";
export const PaymentZodSchema = z.object({
  id: z
    .uuid({ error: "Payment ID is required" })
    .min(1, "Payment ID is required"),
  method: z
    .string({ error: "Payment method is required" })
    .min(1, "Payment method is required"),
  paymentDate: z
    .string({ error: "Payment date is required" })
    .min(1, "Payment date is required"),
  value: z
    .number({ error: "Payment value is required" })
    .positive("Payment value must be a positive number"),
  installment: z
    .number({ error: "Installment is required" })
    .positive("Installment must be a positive number"),
  jobId: z.uuid({ error: "Job ID is required" }).min(1, "Job ID is required"),
});

export const RegisterPaymentZodSchema = PaymentZodSchema.omit({
  id: true,
  jobId: true,
});

export const EditPaymentZodSchema = z
  .object(RegisterPaymentZodSchema.shape, {
    error: (issue) => {
      if (issue.input === undefined) {
        return "At least one field is required for editing payment";
      }
      return undefined; // Use Zod's default message otherwise
    },
  })
  .partial();

export const GetPaymentZodSchema = PaymentZodSchema.pick({
  id: true,
});

export type RegisterPayment = z.infer<typeof RegisterPaymentZodSchema>;
export type EditPayment = z.infer<typeof EditPaymentZodSchema>;
export type GetPayment = z.infer<typeof GetPaymentZodSchema>;

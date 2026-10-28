import { z } from "zod";
import {
  dateSchema,
  formattedDateSchema,
  formattedMoneySchema,
  moneySchema,
} from "../misc/schemas.ts";
export const PaymentZodSchema = z.object({
  id: z
    .uuid({ error: "Payment ID is required" })
    .min(1, "Payment ID is required"),
  method: z
    .string({ error: "Payment method is required" })
    .trim()
    .min(1, "Payment method is required"),
  paymentDate: dateSchema,
  value: moneySchema,
  installment: z
    .number({ error: "Installment is required" })
    .positive("Installment must be a positive number"),
  jobId: z.uuid({ error: "Job ID is required" }).min(1, "Job ID is required"),
}).strict();

export const PaymentResponseZodSchema = z
  .object({
    id: z.uuid(),
    method: z.string(),
    paymentDate: formattedDateSchema,
    value: formattedMoneySchema,
    installment: z.number().positive(),
    jobId: z.uuid(),
  })
  .strict()
  .meta({ id: "PaymentResponse" });

export const PaymentListResponseZodSchema = z.object({
  data: z.array(PaymentResponseZodSchema),
  totalValue: z.number().nonnegative(),
})
  .strict()
  .meta({ id: "PaymentListResponse" });

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
  .partial()
  .strict()
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field is required for editing payment",
  });

export const GetPaymentZodSchema = PaymentZodSchema.pick({
  id: true,
});

export type RegisterPayment = z.infer<typeof RegisterPaymentZodSchema>;
export type PaymentResponse = z.infer<typeof PaymentResponseZodSchema>;
export type PaymentListResponse = z.infer<typeof PaymentListResponseZodSchema>;
export type EditPayment = z.infer<typeof EditPaymentZodSchema>;
export type GetPayment = z.infer<typeof GetPaymentZodSchema>;

import { z } from "zod";
import { moneySchema } from "../misc/schemas.ts";
export const MaterialZodSchema = z.object({
  id: z.uuid({ error: "ID is required" }).min(1, "ID is required"),
  descr: z
    .string({ error: "Description is required" })
    .trim()
    .min(1, "Description is required"),
  supplier: z
    .string({ error: "Supplier is required" })
    .trim()
    .min(1, "Supplier is required")
    .nullable()
    .optional(),
  qnt: z
    .number({ error: "Quantity is required" })
    .positive("Quantity must be a positive number"),
  unitaryVal: moneySchema,
  jobId: z.uuid({ error: "Job ID is required" }).min(1, "Job ID is required"),
}).strict();

export const RegisterMaterialZodSchema = MaterialZodSchema.omit({
  id: true,
  jobId: true,
});

export const GetMaterialZodSchema = MaterialZodSchema.pick({
  id: true,
});

export const EditMaterialZodSchema = z
  .object(RegisterMaterialZodSchema.shape, {
    error: (issue) => {
      if (issue.input === undefined) {
        return "At least one field is required for editing client";
      }
      return undefined; // Use Zod's default message otherwise
    },
  })
  .partial()
  .strict()
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field is required for editing material",
  });


  export type RegisterMaterial = z.infer<typeof RegisterMaterialZodSchema>;
export type EditMaterial = z.infer<typeof EditMaterialZodSchema>;
export type GetMaterial = z.infer<typeof GetMaterialZodSchema>;

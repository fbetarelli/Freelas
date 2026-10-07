import { z } from "zod";
export const MaterialZodSchema = z.object({
  id: z.uuid({ error: "ID is required" }).min(1, "ID is required"),
  descr: z
    .string({ error: "Description is required" })
    .min(1, "Description is required"),
  supplier: z
    .string({ error: "Supplier is required" })
    .min(1, "Supplier is required"),
  qnt: z
    .number({ error: "Quantity is required" })
    .positive("Quantity must be a positive number"),
  unitaryVal: z
    .number({ error: "Unitary value is required" })
    .positive("Unitary value must be a positive number"),
  jobId: z.uuid({ error: "Job ID is required" }).min(1, "Job ID is required"),
});

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
  .partial();


  export type RegisterMaterial = z.infer<typeof RegisterMaterialZodSchema>;
export type EditMaterial = z.infer<typeof EditMaterialZodSchema>;
export type GetMaterial = z.infer<typeof GetMaterialZodSchema>;

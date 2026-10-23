import { z } from "zod";

export const JobZodSchema = z.object({
  id: z.uuid({ error: "Job ID is required" }).min(1, "Job ID is required"),
  jobDate: z
    .string({ error: "Job date is required" })
    .trim()
    .min(1, "Job date is required"),
  descr: z
    .string({ error: "Job description is required" })
    .trim()
    .min(1, "Job description is required"),
  payed: z.boolean({ error: "Job payed status is required" }),
  totalValue: z
    .number({ error: "Job total value is required" })
    .min(1, "Job total value is required"),
  clientId: z
    .uuid({ error: "Client ID is required" })
    .min(1, "Client ID is required"),
  userId: z
    .uuid({ error: "User ID is required" })
    .min(1, "User ID is required"),
}).strict();

export const RegisterJobZodSchema = JobZodSchema.omit({
  id: true,
  clientId: true,
  userId: true,
});

export const EditJobZodSchema = RegisterJobZodSchema.partial()
  .strict()
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field is required for editing job",
  });

export const GetJobZodSchema = JobZodSchema.pick({
  id: true,
});


export type RegisterJob = z.infer<typeof RegisterJobZodSchema>;
export type EditJob = z.infer<typeof EditJobZodSchema>;
export type GetJob = z.infer<typeof GetJobZodSchema>;

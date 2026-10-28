import { z } from "zod";
import { ClientResponseZodSchema } from "../client/schemas.ts";
import { JobResponseZodSchema } from "../job/schemas.ts";
import { formattedMoneySchema } from "../misc/schemas.ts";

export const DashboardResponseZodSchema = z.object({
  clients: z.array(ClientResponseZodSchema),
  jobs: z.array(JobResponseZodSchema),
  profit: formattedMoneySchema,
  count: z.number().int().nonnegative(),
}).strict().meta({ id: "DashboardResponse" });

export type DashboardResponse = z.infer<typeof DashboardResponseZodSchema>;

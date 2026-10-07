import type { JobZodSchema } from "@freelancemanager/shared";
import type z from "zod";

export type Job = z.infer<typeof JobZodSchema>;

export interface JobQueryResult extends Omit<
  Job,
  "jobDate" | "clientId" | "userId" | "totalValue"
> {
  totalvalue: string;
  jobdate: string;
  clientid: string;
  userid: string;
}

export type FormattedJob = Omit<Job, "payed" | "totalValue"> & {
  payed: string;
  totalValue: string;
};

export interface Job {
  id: string;
  jobDate: string;
  descr: string;
  payed: boolean;
  totalValue: number;
  clientId: string;
  userId: string;
}


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

export interface Job {
  id: string;
  jobDate: string;
  descr: string;
  payed: boolean;
  totalValue: number;
  clientId: string;
  userId: string;
}

export interface FormattedJob extends Omit<Job, "payed" | "totalValue"> {
  payed: string;
  totalValue: string;
}

export interface IncomingJob extends Omit<Job, "jobDate" | "payed"> {
  date: string;
  payed: "true" | "false" | undefined;
}

export interface JobType {
  id: string;
  jobDate: string;
  descr: string;
  payed: boolean;
  totalValue: number;
  clientId: string;
  userId: string;
}

export class Job implements JobType {
  id;
  jobDate;
  descr;
  payed;
  totalValue;
  clientId;
  userId;

  constructor({
    id,
    jobDate,
    descr,
    payed,
    totalValue,
    clientId,
    userId,
  }: JobType) {
    this.id = id;
    this.jobDate = jobDate;
    this.descr = descr;
    this.payed = payed;
    this.totalValue = totalValue;
    this.clientId = clientId;
    this.userId = userId;
  }

  getId() {
    return this.id;
  }

  getDate() {
    return this.jobDate;
  }

  getDescription() {
    return this.descr;
  }

  getJobDate() {
    return this.jobDate;
  }

  getTotalValue() {
    return this.totalValue;
  }

  isPayed() {
    return this.payed;
  }

  getClientId() {
    return this.clientId;
  }

  getUserId() {
    return this.userId;
  }
}

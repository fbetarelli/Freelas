export class JobDTO {
  id: string;
  jobDate: string;
  descr: string;
  payed: string;
  totalValue: string;
  clientId: string;

  constructor({ clientId, id, jobDate, descr, payed, totalValue }: JobDTO) {
    this.clientId = clientId;
    this.id = id;
    this.jobDate = jobDate;
    this.descr = descr;
    this.payed = payed;
    this.totalValue = totalValue;
  }
}

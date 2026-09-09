export class MaterialDTO {
  id: string;
  descr: string;
  supplier: string;
  qnt: number;
  totalVal: string;
  unitaryVal: string;
  jobId: string;

  constructor({
    id,
    descr,
    supplier,
    qnt,
    unitaryVal,
    totalVal,
    jobId,
  }: MaterialDTO) {
    this.id = id;
    this.descr = descr;
    this.supplier = supplier;
    this.qnt = qnt;
    this.unitaryVal = unitaryVal;
    this.totalVal = totalVal;
    this.jobId = jobId;
  }
}

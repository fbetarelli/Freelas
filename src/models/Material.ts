export interface MaterialType {
  id: string;
  descr: string;
  supplier: string;
  qnt: number;
  unitaryVal: number;
  jobId: string;
}

export class Material implements MaterialType {
  id;
  descr;
  supplier;
  qnt;
  unitaryVal;
  jobId;

  constructor({ id, descr, supplier, qnt, unitaryVal, jobId }: MaterialType) {
    this.id = id;
    this.descr = descr;
    this.supplier = supplier;
    this.qnt = qnt;
    this.unitaryVal = unitaryVal;
    this.jobId = jobId;
  }

  getId() {
    return this.id;
  }

  getDescription() {
    return this.descr;
  }

  getSupplier() {
    return this.supplier;
  }

  getQuantity() {
    return this.qnt;
  }

  getUnitaryValue() {
    return this.unitaryVal;
  }

  getJobId() {
    return this.jobId;
  }

  getSubtotal() {
    return this.qnt * this.unitaryVal;
  }
}

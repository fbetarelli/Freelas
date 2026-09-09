export interface PaymentType {
  id: string;
  method: string;
  paymentDate: string;
  value: number;
  installment: number;
  jobId: string;
}

export class Payment implements PaymentType {
  id;
  method;
  paymentDate;
  value;
  installment;
  jobId;

  constructor({ id, method, paymentDate, value, installment, jobId }: PaymentType) {
    this.id = id;
    this.method = method;
    this.paymentDate = paymentDate;
    this.value = value;
    this.installment = installment;
    this.jobId = jobId;
  }

  getId() {
    return this.id;
  }

  getMethod() {
    return this.method;
  }

  getPaymentDate() {
    return this.paymentDate;
  }

  getValue() {
    return this.value;
  }

  getInstallment() {
    return this.installment;
  }

  getJobId() {
    return this.jobId;
  }
}

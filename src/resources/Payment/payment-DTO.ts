export class PaymentDTO {
  id: string;
  method: string;
  paymentDate: string;
  value: string;
  installment: string;
  jobId: string;

  constructor({
    id,
    method,
    paymentDate,
    value,
    installment,
    jobId,
  }: PaymentDTO) {
    this.id = id;
    this.method = method;
    this.paymentDate = paymentDate;
    this.value = value;
    this.installment = installment;
    this.jobId = jobId;
  }
}

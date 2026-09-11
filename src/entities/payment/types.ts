export interface Payment {
  id: string;
  method: string;
  paymentDate: string;
  value: number;
  installment: number;
  jobId: string;
}

export interface FormattedPayment extends Omit<Payment, "value"> {
  value: string;
}

export interface Payment {
  id: string;
  method: string;
  paymentDate: string;
  value: number;
  installment: number;
  jobId: string;
}

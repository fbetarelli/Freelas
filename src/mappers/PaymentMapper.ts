import { Payment } from "../models/Payment.ts";
import { formatarData, formatarValor } from "../utils/formattingHelpers.ts";
import { PaymentDTO } from "../DTO/PaymentDTO.ts";

export function toDTO(obj: Payment): PaymentDTO {
  let dto = new PaymentDTO({
    id: obj.getId(),
    method: obj.getMethod(),
    paymentDate: formatarData(obj.getPaymentDate()),
    value: formatarValor(obj.getValue()),
    installment: String(obj.getInstallment()),
    jobId: obj.getJobId(),
  });
  return dto;
}

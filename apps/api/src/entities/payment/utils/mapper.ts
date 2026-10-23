import { formatDate, formatValueToString } from "../../../utils/formatting-helpers.ts";
import type { PaymentQueryResult } from "../dao.ts";
import type { FormattedPayment } from "../types.ts";

export const toFormattedPayment = (payment: PaymentQueryResult): FormattedPayment => {
  return {
    id: payment.id,
    method: payment.method,
    installment: payment.installment,
    paymentDate: formatDate(payment.paymentdate),
    jobId: payment.jobid,
    value: formatValueToString(Number(payment.value)),
  };
};

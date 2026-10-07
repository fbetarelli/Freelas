import { formatDate, formatValueToString } from "../../../utils/formatting-helpers.ts";
import type { PaymentQueryResult } from "../dao.ts";
import type { FormattedPayment } from "../types.ts";

export const toFormattedPayment = (payment: PaymentQueryResult): FormattedPayment => {
  const { paymentdate, jobid, value, ...rest } = payment;
  return {
    ...rest,
    paymentDate: formatDate(paymentdate),
    jobId: jobid,
    value: formatValueToString(value)

  };
};

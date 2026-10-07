import { formatDate, formatValueToString } from "../../../utils/formatting-helpers.ts";
import type { FormattedJob, JobQueryResult } from "../types.ts";

export const mapToJob = (dbJob: JobQueryResult): FormattedJob => {
  return {
    id: dbJob.id,
    descr: dbJob.descr,
    clientId: dbJob.clientid,
    userId: dbJob.userid,
    payed: dbJob.payed ? "Pagamento Realizado" : "Aguardando Pagamento",
    jobDate: formatDate(dbJob.jobdate),
    totalValue: formatValueToString(Number(dbJob.totalvalue)),
  };
};

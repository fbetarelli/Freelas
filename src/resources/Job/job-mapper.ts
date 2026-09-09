import { formatarData, formatarValor } from "../../utils/formattingHelpers.ts";
import { JobDTO } from "./job-DTO.ts";
import { Job } from "./types.ts";

export function toDTO(obj: Job): JobDTO {
  let dto = new JobDTO({
    id: obj.getId(),
    clientId: obj.getClientId(),
    jobDate: formatarData(obj.getJobDate()),
    descr: obj.getDescription(),
    payed: obj.isPayed() ? "Serviço pago" : "Aguardando pagamento",
    totalValue: formatarValor(obj.getTotalValue()),
  });
  return dto;
}

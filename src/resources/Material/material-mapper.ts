import { formatarValor } from "../../utils/formattingHelpers.ts";
import { MaterialDTO } from "./material-DTO.ts";
import { Material } from "./types.ts";

export function toDTO(
  obj: Omit<Material, " jobId">,
  jobId: string,
): MaterialDTO {
  let valorUni = formatarValor(obj.getUnitaryValue());
  let dto = new MaterialDTO({
    id: obj.getId(),
    descr: obj.getDescription(),
    supplier: obj.getSupplier(),
    qnt: obj.getQuantity(),
    unitaryVal: valorUni,
    totalVal: formatarValor(obj.getUnitaryValue() * obj.getQuantity()),
    jobId: jobId,
  });

  return dto;
}

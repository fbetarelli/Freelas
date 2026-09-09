import { Material } from  "../models/Material.ts";
import { formatarValor } from  "../utils/formattingHelpers.ts";
import { MaterialDTO } from  "../DTO/MaterialDTO.ts";

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

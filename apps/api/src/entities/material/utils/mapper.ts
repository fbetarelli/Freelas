import { formatValueToString } from "../../../utils/formatting-helpers.ts";
import type { MaterialQueryResult } from "../dao.ts";
import type { FormattedMaterial } from "../types.ts";

export const toFormattedMaterial = (
  material: MaterialQueryResult,
): FormattedMaterial => {
  return {
    id: material.id,
    descr: material.descr,
    supplier: material.supplier,
    qnt: material.qnt,
    jobId: material.jobid,
    unitaryVal: formatValueToString(Number(material.unitaryval)),
    totalVal: formatValueToString(Number(material.totalval)),
  };
};

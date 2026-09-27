import { formatValueToString } from "../../../utils/formatting-helpers.ts";
import type { MaterialQueryResult } from "../dao.ts";
import type { FormattedMaterial } from "../types.ts";

export const toFormattedMaterial = (
  material: MaterialQueryResult,
): FormattedMaterial => {
  const { unitaryval, jobid, ...rest } = material;
  return {
    ...rest,
    jobId: jobid,
    unitaryVal: formatValueToString(Number(unitaryval)),
    totalVal: formatValueToString(Number(unitaryval) * material.qnt),
  };
};

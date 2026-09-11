export interface Material {
  id: string;
  descr: string;
  supplier: string;
  qnt: number;
  unitaryVal: number;
  jobId: string;
}

export interface FormattedMaterial extends Omit<Material, "unitaryVal"> {
  unitaryVal: string;
  totalVal: string;
}

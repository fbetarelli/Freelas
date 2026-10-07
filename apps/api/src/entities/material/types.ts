import type { MaterialZodSchema } from "@freelancemanager/shared";
import { z } from "zod";
export type Material = z.infer<typeof MaterialZodSchema>;

export interface FormattedMaterial extends Omit<Material, "unitaryVal"> {
  unitaryVal: string;
  totalVal: string;
}

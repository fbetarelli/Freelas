import type { MaterialResponse, MaterialZodSchema } from "@freelancemanager/shared";
import { z } from "zod";
export type Material = z.infer<typeof MaterialZodSchema>;

export type FormattedMaterial = MaterialResponse;

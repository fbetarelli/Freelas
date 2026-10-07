// export interface Client {
//   id: string;
//   name: string;
//   address?: string | null;
//   contact: string;
//   userId: string;
//   // dateModified: string;
// }

import type { ClientZodSchema } from "@freelancemanager/shared";
import { z } from "zod";
export type Client = z.infer<typeof ClientZodSchema>;

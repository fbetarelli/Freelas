import { z } from "zod";

export const PaginatedSearchZodSchema = z.object({
  page: z.number().int().positive().optional(),
  search: z.string().optional(),
});
export type PaginatedSearch = z.infer<typeof PaginatedSearchZodSchema>;

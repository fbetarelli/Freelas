import { z } from "zod";

export const MAX_MONEY = 99999.99;

export const moneySchema = z
  .number()
  .min(0.01)
  .max(MAX_MONEY)
  .refine((value) => {
    const cents = value * 100;
    return (
      Math.abs(cents - Math.round(cents)) <=
      Number.EPSILON * Math.max(1, Math.abs(cents))
    );
  }, {
    message: "Money values may have at most two decimal places",
  });

export const dateSchema = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must use YYYY-MM-DD")
  .refine((value) => {
    const [year, month, day] = value.split("-").map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    return (
      date.getUTCFullYear() === year &&
      date.getUTCMonth() === month - 1 &&
      date.getUTCDate() === day
    );
  }, "Date must be a valid calendar date");

export const PaginatedSearchZodSchema = z.object({
  page: z.number().int().positive().optional(),
  search: z.string().optional(),
});
export type PaginatedSearch = z.infer<typeof PaginatedSearchZodSchema>;

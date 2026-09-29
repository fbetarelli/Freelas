import z from "zod";

export const UserZodSchema = z.object({
  id: z.uuid(),
  username: z.string().min(3, "Username must be at least 3 characters long"),
  login: z.email().min(1, "Login is required"),
  hashPassword: z
    .string()
    .min(3, "Password must be at least 3 characters long"),
});

export const RegisterUserZodSchema = z.object({
  username: z
    .string({ error: "Username is required" })
    .min(3, "Username must be at least 3 characters long"),
  login: z.email({ error: "Login is required" }).min(1, "Login is required"),
  password: z
    .string({ error: "Password is required" })
    .min(3, "Password must be at least 3 characters long"),
});

export const LoginUserZodSchema = RegisterUserZodSchema.pick({
  login: true,
  password: true,
});
export const EditUserZodSchema = z
  .object(RegisterUserZodSchema.shape, {
    error: (issue) => {
      if (issue.input === undefined) {
        return "At least one field is required for editing user";
      }
      return undefined; // Use Zod's default message otherwise
    },
  })
  .partial();

export type User = z.infer<typeof UserZodSchema>;
export type RegisterUser = z.infer<typeof RegisterUserZodSchema>;
export type EditUser = z.infer<typeof EditUserZodSchema>;
export type LoginUser = z.infer<typeof LoginUserZodSchema>;

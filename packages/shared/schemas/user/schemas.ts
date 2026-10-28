import z from "zod";

export const UserZodSchema = z.object({
  id: z.uuid(),
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters long"),
  login: z.string().trim().email().min(1, "Login is required"),
  hashPassword: z
    .string()
    .min(3, "Password must be at least 3 characters long"),
}).strict();

export const UserResponseZodSchema = UserZodSchema
  .omit({ hashPassword: true })
  .meta({ id: "UserResponse" });

export const LogoutResponseZodSchema = z.literal("OK").meta({ id: "LogoutResponse" });

export const RegisterUserZodSchema = z.object({
  username: z
    .string({ error: "Username is required" })
    .trim()
    .min(3, "Username must be at least 3 characters long"),
  login: z
    .string({ error: "Login is required" })
    .trim()
    .email({ error: "Login is required" })
    .min(1, "Login is required"),
  password: z
    .string({ error: "Password is required" })
    .min(3, "Password must be at least 3 characters long"),
}).strict();

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
  .partial()
  .strict()
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field is required for editing user",
  });

export type User = z.infer<typeof UserZodSchema>;
export type UserResponse = z.infer<typeof UserResponseZodSchema>;
export type RegisterUser = z.infer<typeof RegisterUserZodSchema>;
export type EditUser = z.infer<typeof EditUserZodSchema>;
export type LoginUser = z.infer<typeof LoginUserZodSchema>;

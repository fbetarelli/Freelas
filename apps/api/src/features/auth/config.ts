import { config } from "dotenv";
import { z } from "zod";

config();

const authEnvironmentSchema = z.object({
  ACCESS_TOKEN_SECRET: z.string().min(1),
  JWT_ISSUER: z.string().min(1),
  JWT_AUDIENCE: z.string().min(1),
});

export const getAuthConfig = () => {
  const result = authEnvironmentSchema.safeParse(process.env);

  if (!result.success) {
    const missingVariables = result.error.issues
      .map((issue) => issue.path.join("."))
      .join(", ");
    throw new Error(
      `Missing or invalid authentication environment variables: ${missingVariables}`,
    );
  }

  return result.data;
};

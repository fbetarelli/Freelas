import { OpenApiGeneratorV31 } from "@asteasolutions/zod-to-openapi";
import { registerOpenApiRoutes } from "./routes/index.ts";
import { createOpenApiRegistry } from "./registry.ts";

/**
 * OpenAPI document entry point. Entity registrations, schemas, and examples
 * live beside this entry point so route details stay grouped by purpose.
 */
export const generateOpenApiDocument = () => {
  // A fresh registry keeps repeated document generation free of duplicate routes.
  const registry = createOpenApiRegistry();
  registerOpenApiRoutes(registry);

  const generator = new OpenApiGeneratorV31(registry.definitions);
  return generator.generateDocument({
    openapi: "3.1.0",
    info: { title: "FreelanceManager API", version: "1.0.0" },
    tags: [
      { name: "auth", description: "Authentication and session management." },
      { name: "user", description: "Current user account." },
      { name: "clients", description: "Client records." },
      { name: "jobs", description: "Client jobs." },
      { name: "materials", description: "Materials used on jobs." },
      { name: "payments", description: "Payments received for jobs." },
      { name: "dashboard", description: "Dashboard summary." },
    ],
    security: [{ cookieAuth: [] }],
  });
};

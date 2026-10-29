import type { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { registerAuthRoutes } from "./auth.ts";
import { registerClientRoutes } from "./clients.ts";
import { registerDashboardRoutes } from "./dashboard.ts";
import { registerJobRoutes } from "./jobs.ts";
import { registerMaterialRoutes } from "./materials.ts";
import { registerPaymentRoutes } from "./payments.ts";
import { registerUserRoutes } from "./user.ts";

/** Collects entity route declarations into the shared OpenAPI registry. */
export function registerOpenApiRoutes(registry: OpenAPIRegistry) {
  registerAuthRoutes(registry);
  registerUserRoutes(registry);
  registerClientRoutes(registry);
  registerJobRoutes(registry);
  registerMaterialRoutes(registry);
  registerPaymentRoutes(registry);
  registerDashboardRoutes(registry);
}

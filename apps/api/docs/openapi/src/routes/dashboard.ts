import { openApiSchemas } from "../schemas.ts";
import { registerApiRoute } from "../registry.ts";
import type { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";

export function registerDashboardRoutes(registry: OpenAPIRegistry) {
  registerApiRoute(registry, "get", "/dashboard", "dashboard", "Get dashboard data", 200, {
    response: { schema: openApiSchemas.dashboardResponse },
    errors: ["Unauthorized"],
  });
}

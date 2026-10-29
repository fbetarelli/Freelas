import { requestExamples } from "../examples.ts";
import { openApiSchemas } from "../schemas.ts";
import { responseExamples } from "../examples.ts";
import { registerApiRoute } from "../registry.ts";
import type { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";

export function registerUserRoutes(registry: OpenAPIRegistry) {
  registerApiRoute(registry, "get", "/me", "user", "Get the current user", 200, {
    response: { schema: openApiSchemas.userResponse, example: responseExamples.user },
    errors: ["Unauthorized"],
  });
  registerApiRoute(registry, "patch", "/edit-user", "user", "Edit the current user", 200, {
    body: { schema: openApiSchemas.userEdit, example: requestExamples.userEdit },
    response: { schema: openApiSchemas.userResponse },
    errors: ["BadRequest", "Unauthorized", "Conflict"],
  });
}

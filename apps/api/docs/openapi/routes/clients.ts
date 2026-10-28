import { requestExamples } from "../examples.ts";
import { openApiSchemas } from "../schemas.ts";
import { registerApiRoute } from "../registry.ts";
import type { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";

export function registerClientRoutes(registry: OpenAPIRegistry) {
  registerApiRoute(registry, "post", "/clients", "clients", "Create a client", 201, {
    body: { schema: openApiSchemas.clientCreate, example: requestExamples.client },
    response: { schema: openApiSchemas.clientResponse },
    errors: ["BadRequest", "Unauthorized"],
  });
  registerApiRoute(registry, "get", "/clients/{id}", "clients", "Get a client", 200, {
    params: openApiSchemas.clientParams,
    response: { schema: openApiSchemas.clientResponse },
    errors: ["BadRequest", "Unauthorized", "NotFound"],
  });
  registerApiRoute(registry, "patch", "/clients/{id}", "clients", "Edit a client", 200, {
    params: openApiSchemas.clientParams,
    body: { schema: openApiSchemas.clientEdit, example: requestExamples.clientEdit },
    response: { schema: openApiSchemas.clientResponse },
    errors: ["BadRequest", "Unauthorized", "NotFound"],
  });
  registerApiRoute(registry, "delete", "/clients/{id}", "clients", "Delete a client", 204, {
    params: openApiSchemas.clientParams,
    errors: ["BadRequest", "Unauthorized", "NotFound"],
  });
  registerApiRoute(registry, "get", "/clients", "clients", "List clients", 200, {
    query: openApiSchemas.pagination,
    response: { schema: openApiSchemas.clientListResponse },
    errors: ["BadRequest", "Unauthorized"],
  });
}

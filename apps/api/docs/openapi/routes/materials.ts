import { requestExamples } from "../examples.ts";
import { openApiSchemas } from "../schemas.ts";
import { registerApiRoute } from "../registry.ts";
import type { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";

export function registerMaterialRoutes(registry: OpenAPIRegistry) {
  registerApiRoute(registry, "post", "/jobs/{id}/materials", "materials", "Add material to a job", 201, {
    params: openApiSchemas.jobParams,
    body: { schema: openApiSchemas.materialCreate, example: requestExamples.material },
    response: { schema: openApiSchemas.materialResponse },
    errors: ["BadRequest", "Unauthorized", "NotFound"],
  });
  registerApiRoute(registry, "get", "/jobs/{id}/materials", "materials", "List materials for a job", 200, {
    params: openApiSchemas.jobParams,
    response: { schema: openApiSchemas.materialListResponse },
    errors: ["BadRequest", "Unauthorized", "NotFound"],
  });
  registerApiRoute(registry, "patch", "/materials/{id}", "materials", "Edit material", 200, {
    params: openApiSchemas.materialParams,
    body: { schema: openApiSchemas.materialEdit, example: requestExamples.materialEdit },
    response: { schema: openApiSchemas.materialResponse },
    errors: ["BadRequest", "Unauthorized", "NotFound"],
  });
  registerApiRoute(registry, "delete", "/materials/{id}", "materials", "Delete material", 204, {
    params: openApiSchemas.materialParams,
    errors: ["BadRequest", "Unauthorized", "NotFound"],
  });
}

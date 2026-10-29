import { requestExamples, responseExamples } from "../examples.ts";
import { openApiSchemas } from "../schemas.ts";
import { registerApiRoute } from "../registry.ts";
import type { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";

export function registerJobRoutes(registry: OpenAPIRegistry) {
  registerApiRoute(registry, "get", "/clients/{id}/jobs", "jobs", "List jobs for a client", 200, {
    params: openApiSchemas.clientParams,
    response: { schema: openApiSchemas.jobArrayResponse },
    errors: ["BadRequest", "Unauthorized", "NotFound"],
  });
  registerApiRoute(registry, "post", "/clients/{id}/jobs", "jobs", "Create a job for a client", 201, {
    params: openApiSchemas.clientParams,
    body: { schema: openApiSchemas.jobCreate, example: requestExamples.job },
    response: { schema: openApiSchemas.jobResponse, example: responseExamples.job },
    errors: ["BadRequest", "Unauthorized", "NotFound"],
  });
  registerApiRoute(registry, "get", "/jobs", "jobs", "List jobs", 200, {
    query: openApiSchemas.pagination,
    response: { schema: openApiSchemas.jobListResponse },
    errors: ["BadRequest", "Unauthorized"],
  });
  registerApiRoute(registry, "get", "/jobs/{id}", "jobs", "Get a job", 200, {
    params: openApiSchemas.jobParams,
    response: { schema: openApiSchemas.jobResponse },
    errors: ["BadRequest", "Unauthorized", "NotFound"],
  });
  registerApiRoute(registry, "patch", "/jobs/{id}", "jobs", "Edit a job", 200, {
    params: openApiSchemas.jobParams,
    body: { schema: openApiSchemas.jobEdit, example: requestExamples.jobEdit },
    response: { schema: openApiSchemas.jobResponse },
    errors: ["BadRequest", "Unauthorized", "NotFound"],
  });
  registerApiRoute(registry, "delete", "/jobs/{id}", "jobs", "Delete a job", 204, {
    params: openApiSchemas.jobParams,
    errors: ["BadRequest", "Unauthorized", "NotFound"],
  });
}

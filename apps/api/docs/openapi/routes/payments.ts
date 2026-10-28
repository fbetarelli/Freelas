import { requestExamples } from "../examples.ts";
import { openApiSchemas } from "../schemas.ts";
import { registerApiRoute } from "../registry.ts";
import type { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";

export function registerPaymentRoutes(registry: OpenAPIRegistry) {
  registerApiRoute(registry, "get", "/jobs/{id}/payments", "payments", "List payments for a job", 200, {
    params: openApiSchemas.jobParams,
    response: { schema: openApiSchemas.paymentListResponse },
    errors: ["BadRequest", "Unauthorized", "NotFound"],
  });
  registerApiRoute(registry, "post", "/jobs/{id}/payments", "payments", "Add payment to a job", 201, {
    params: openApiSchemas.jobParams,
    body: { schema: openApiSchemas.paymentCreate, example: requestExamples.payment },
    response: { schema: openApiSchemas.paymentResponse },
    errors: ["BadRequest", "Unauthorized", "NotFound"],
  });
  registerApiRoute(registry, "patch", "/payment/{id}", "payments", "Edit payment", 200, {
    params: openApiSchemas.paymentParams,
    body: { schema: openApiSchemas.paymentEdit, example: requestExamples.paymentEdit },
    response: { schema: openApiSchemas.paymentResponse },
    errors: ["BadRequest", "Unauthorized", "NotFound"],
  });
  registerApiRoute(registry, "delete", "/payment/{id}", "payments", "Delete payment", 204, {
    params: openApiSchemas.paymentParams,
    errors: ["BadRequest", "Unauthorized", "NotFound"],
  });
}

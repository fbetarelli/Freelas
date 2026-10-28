import { requestExamples } from "../examples.ts";
import { openApiSchemas } from "../schemas.ts";
import { registerApiRoute } from "../registry.ts";
import type { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";

export function registerAuthRoutes(registry: OpenAPIRegistry) {
  registerApiRoute(registry, "post", "/login", "auth", "Log in", 200, {
    public: true,
    body: { schema: openApiSchemas.userLogin, example: requestExamples.login },
    response: { schema: openApiSchemas.userResponse },
    errors: ["BadRequest"],
  });
  registerApiRoute(registry, "post", "/register", "auth", "Register an account", 201, {
    public: true,
    body: { schema: openApiSchemas.userCreate, example: requestExamples.user },
    response: { schema: openApiSchemas.userResponse },
    errors: ["BadRequest", "Conflict"],
  });
  registerApiRoute(registry, "post", "/logout", "auth", "Log out", 200, {
    public: true,
    response: {
      schema: openApiSchemas.logoutResponse,
      contentType: "text/html",
    },
    errors: [],
  });
}

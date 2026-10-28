import {
  OpenAPIRegistry,
  type RouteConfig,
} from "@asteasolutions/zod-to-openapi";
import type { ZodType } from "zod";
import { openApiSchemas } from "./schemas.ts";

export type ApiErrorName = "BadRequest" | "Unauthorized" | "NotFound" | "Conflict";

export type ApiRouteOptions = {
  params?: NonNullable<RouteConfig["request"]>["params"];
  query?: typeof openApiSchemas.pagination;
  body?: { schema: ZodType; example: object };
  response?: { schema: ZodType; contentType?: string };
  public?: boolean;
  errors: ApiErrorName[];
};

const statusByErrorName: Record<ApiErrorName, string> = {
  BadRequest: "400",
  Unauthorized: "401",
  NotFound: "404",
  Conflict: "409",
} as const;

const reusableErrors: ReadonlyArray<readonly [ApiErrorName, string]> = [
  ["BadRequest", "The request is invalid."],
  ["Unauthorized", "Authentication is required or invalid."],
  ["NotFound", "The requested resource was not found."],
  ["Conflict", "The request conflicts with existing data."],
];

/** Sets up the cookie scheme and the shared error components once per document. */
export function createOpenApiRegistry() {
  const registry = new OpenAPIRegistry();

  registry.registerComponent("securitySchemes", "cookieAuth", {
    type: "apiKey",
    in: "cookie",
    name: "token",
  });

  for (const [name, description] of reusableErrors) {
    registry.registerComponent("responses", name, {
      description,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: { message: { type: "string" } },
            required: ["message"],
          },
        },
      },
    });
  }

  return registry;
}

/** Registers one route and links its request schemas to the shared components. */
export function registerApiRoute(
  registry: OpenAPIRegistry,
  method: RouteConfig["method"],
  path: string,
  tag: string,
  summary: string,
  success: number,
  options: ApiRouteOptions,
) {
  const request: NonNullable<RouteConfig["request"]> = {};
  if (options.params) request.params = options.params;
  if (options.query) request.query = options.query;
  if (options.body) {
    request.body = {
      content: {
        "application/json": {
          schema: options.body.schema,
          example: options.body.example,
        },
      },
    };
  }

  const successResponse = {
    description: "Successful response.",
    ...(options.response
      ? {
          content: {
            [options.response.contentType ?? "application/json"]: {
              schema: options.response.schema,
            },
          },
        }
      : {}),
  };
  const responses: RouteConfig["responses"] = {
    [success]: successResponse,
  };
  for (const name of options.errors) {
    const status = statusByErrorName[name];
    responses[status] = { $ref: `#/components/responses/${name}` };
  }

  registry.registerPath({
    method,
    path,
    tags: [tag],
    summary,
    ...(options.public ? { security: [] } : {}),
    ...(Object.keys(request).length > 0 ? { request } : {}),
    responses,
  });
}

import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "../../../../../app.ts";
import { generateOpenApiDocument } from "../../../../../docs/openapi/src/index.ts";
import {
  collectAppRoutes,
  routeKey,
  type RouteRow,
} from "../support/route-helpers.ts";

// This proves no route serves a request without a cookie; it does not prove every route has authenticate in its chain, because requireUser also returns 401.

const id = "123e4567-e89b-42d3-a456-426614174000";
const methods = ["get", "post", "patch", "delete"] as const;
type Method = (typeof methods)[number];
type Operation = NonNullable<
  ReturnType<typeof generateOpenApiDocument>["paths"]
>[string][Method];
type OperationCase = {
  method: Method;
  path: string;
  operation: NonNullable<Operation>;
};

const document = generateOpenApiDocument();

const requestMethods = {
  get: (path: string) => request(app).get(path),
  post: (path: string) => request(app).post(path),
  patch: (path: string) => request(app).patch(path),
  delete: (path: string) => request(app).delete(path),
};

function collectDocumentOperations(): OperationCase[] {
  return Object.entries(document.paths ?? {}).flatMap(([path, pathItem]) =>
    methods.flatMap((method) => {
      const operation = pathItem?.[method];
      return operation ? [{ method, path, operation }] : [];
    }),
  );
}

function operationRequestBody(operation: NonNullable<Operation>) {
  const requestBody: unknown = operation.requestBody;
  if (!isRecord(requestBody) || !isRecord(requestBody.content)) return undefined;

  const jsonContent = requestBody.content["application/json"];
  if (!isRecord(jsonContent) || !isRecord(jsonContent.example)) return undefined;

  return jsonContent.example;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function concretePath(path: string) {
  return path.replace(/\{[^}]+\}/g, id);
}

function normalizePath(path: string) {
  return path.replace(/:([^/]+)/g, "{$1}");
}

function normalizedRouteKey(route: RouteRow) {
  return routeKey({ ...route, path: normalizePath(route.path) });
}

function routeCoverageIssues(
  registeredRoutes: RouteRow[],
  documentedRoutes: RouteRow[],
) {
  const registeredKeys = registeredRoutes.map(normalizedRouteKey);
  const documentedKeys = documentedRoutes.map(normalizedRouteKey);
  const issues: string[] = [];

  for (const key of new Set(registeredKeys)) {
    if (registeredKeys.filter((candidate) => candidate === key).length > 1) {
      issues.push(`duplicate Express route: ${key}`);
    }
  }
  for (const key of new Set(documentedKeys)) {
    if (documentedKeys.filter((candidate) => candidate === key).length > 1) {
      issues.push(`duplicate OpenAPI operation: ${key}`);
    }
  }

  for (const key of registeredKeys) {
    if (!documentedKeys.includes(key)) {
      issues.push(`missing from OpenAPI: ${key}`);
    }
  }
  for (const key of documentedKeys) {
    if (!registeredKeys.includes(key)) {
      issues.push(`missing from Express app: ${key}`);
    }
  }

  return issues;
}

function expectCompleteRouteCoverage(
  registeredRoutes: RouteRow[],
  documentedRoutes: RouteRow[],
) {
  const issues = routeCoverageIssues(registeredRoutes, documentedRoutes);
  if (issues.length > 0) {
    throw new Error(issues.join("\n"));
  }
}

const operations = collectDocumentOperations();
const protectedOperations = operations.filter(({ operation }) => {
  const security = operation.security ?? document.security;
  return Boolean(security?.length);
});
const publicOperations = operations.filter(
  ({ operation }) => operation.security?.length === 0,
);

describe("protected routes", () => {
  it.each(protectedOperations)(
    "$method $path returns 401 without a cookie",
    async ({ method, path, operation }) => {
      const body = operationRequestBody(operation);
      const apiRequest = requestMethods[method](concretePath(path));
      const response = body === undefined ? await apiRequest : await apiRequest.send(body);

      expect(response.status).toBe(401);
    },
  );

  it.each(publicOperations)(
    "$method $path is not protected",
    async ({ method, path }) => {
      const response = await requestMethods[method](concretePath(path));

      expect(response.status).not.toBe(401);
    },
  );

  it("documents every registered route exactly once", () => {
    const registeredRoutes = collectAppRoutes(app);
    const documentedRoutes = operations.map(({ method, path }) => ({
      method: method.toUpperCase(),
      path,
    }));

    expectCompleteRouteCoverage(registeredRoutes, documentedRoutes);
  });

  it("names a route removed from the OpenAPI registry", () => {
    const route = { method: "GET", path: "/me" };
    const documentedRoutes = operations
      .filter(({ method, path }) => !(method === "get" && path === route.path))
      .map(({ method, path }) => ({ method: method.toUpperCase(), path }));

    expect(routeCoverageIssues(collectAppRoutes(app), documentedRoutes)).toContain(
      `missing from OpenAPI: ${routeKey(route)}`,
    );
  });

  it("names an Express route missing from the app", () => {
    const route = { method: "GET", path: "/me" };
    const registeredRoutes = collectAppRoutes(app).filter(
      (candidate) => normalizedRouteKey(candidate) !== normalizedRouteKey(route),
    );
    const documentedRoutes = operations.map(({ method, path }) => ({
      method: method.toUpperCase(),
      path,
    }));

    expect(routeCoverageIssues(registeredRoutes, documentedRoutes)).toContain(
      `missing from Express app: ${routeKey(route)}`,
    );
  });
});

import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "../../../../app.ts";
import {
  collectRoutes,
  hasRouterStack,
  routeKey,
  type RouteRow as CollectedRouteRow,
} from "./protected-routes-helper.ts";

// This table proves no route serves a request without a cookie; it does not prove every route has authenticate in its chain, because requireUser also returns 401.

const id = "123e4567-e89b-42d3-a456-426614174000";

const validClient = {
  name: "valid name",
  address: "valid address",
  contact: "valid contact",
};
const validJob = {
  jobDate: "2026-01-01",
  descr: "valid description",
  payed: false,
  totalValue: 100,
};
const validMaterial = {
  descr: "valid description",
  supplier: "valid supplier",
  qnt: 1,
  unitaryVal: 10,
};
const validPayment = {
  method: "cash",
  paymentDate: "2026-01-01",
  value: 10,
  installment: 1,
};
const validUserEdit = {
  username: "valid username",
};

type Method = "GET" | "POST" | "PATCH" | "DELETE";
type RouteRow = {
  method: Method;
  path: string;
  body?: object;
};

const protectedRoutes: RouteRow[] = [
  { method: "GET", path: "/me" },
  { method: "PATCH", path: "/edit-user", body: validUserEdit },
  { method: "POST", path: "/clients", body: validClient },
  { method: "GET", path: "/clients/:id" },
  { method: "PATCH", path: "/clients/:id", body: validClient },
  { method: "DELETE", path: "/clients/:id" },
  { method: "GET", path: "/clients" },
  { method: "GET", path: "/clients/:id/jobs" },
  { method: "POST", path: "/clients/:id/jobs", body: validJob },
  { method: "GET", path: "/jobs" },
  { method: "GET", path: "/jobs/:id" },
  { method: "PATCH", path: "/jobs/:id", body: validJob },
  { method: "DELETE", path: "/jobs/:id" },
  { method: "POST", path: "/jobs/:id/materials", body: validMaterial },
  { method: "GET", path: "/jobs/:id/materials" },
  { method: "PATCH", path: "/materials/:id", body: validMaterial },
  { method: "DELETE", path: "/materials/:id" },
  { method: "GET", path: "/jobs/:id/payments" },
  { method: "POST", path: "/jobs/:id/payments", body: validPayment },
  { method: "PATCH", path: "/payment/:id", body: validPayment },
  { method: "DELETE", path: "/payment/:id" },
  { method: "GET", path: "/dashboard" },
];

const publicRoutes: RouteRow[] = [
  { method: "POST", path: "/login" },
  { method: "POST", path: "/register" },
  { method: "POST", path: "/logout" },
];

function concretePath(path: string) {
  return path.replace(/:[^/]+/g, id);
}

function makeRequest(method: Method, path: string, body?: object) {
  const requestMethods = {
    GET: "get",
    POST: "post",
    PATCH: "patch",
    DELETE: "delete",
  } as const;

  return request(app)[requestMethods[method]](concretePath(path)).send(body);
}

describe("protected routes", () => {
  it.each(protectedRoutes)(
    "$method $path returns 401 without a cookie",
    async (route) => {
      const response = await makeRequest(route.method, route.path, route.body);

      expect(response.status).toBe(401);
    },
  );

  it.each(publicRoutes)(
    "$method $path is not protected",
    async (route) => {
      const response = await makeRequest(route.method, route.path);

      expect(response.status).not.toBe(401);
    },
  );

  it("classifies every registered route exactly once", () => {
    const registeredRoutes: CollectedRouteRow[] = app.router.stack.flatMap(
      (layer) => (hasRouterStack(layer.handle) ? collectRoutes(layer.handle) : []),
    );
    const classifiedRoutes = [...protectedRoutes, ...publicRoutes];
    const registeredKeys = new Set(registeredRoutes.map(routeKey));
    const classifiedKeys = new Set(classifiedRoutes.map(routeKey));

    expect(
      registeredRoutes
        .filter((route) => !classifiedKeys.has(routeKey(route)))
        .map(routeKey),
    ).toEqual([]);
    expect(
      classifiedRoutes
        .filter((route) => !registeredKeys.has(routeKey(route)))
        .map(routeKey),
    ).toEqual([]);
    expect(classifiedKeys.size).toBe(classifiedRoutes.length);
  });
});

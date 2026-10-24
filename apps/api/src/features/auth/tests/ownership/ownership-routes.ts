import {
  makeJob,
  makeMaterial,
  makePayment,
  registerAndLogin,
} from "../../../../../tests/utils/setup-helpers.ts";

export const nonexistentId = "123e4567-e89b-42d3-a456-426614174000";
export const malformedId = "not-a-uuid";

type RouteMethod = "GET" | "PATCH" | "POST" | "DELETE";
type RouteTarget = "client" | "job" | "material" | "payment";

export type OwnershipRoute = {
  method: RouteMethod;
  path: string;
  target: RouteTarget;
  body?: object;
};

type OwnershipIds = {
  client: string;
  job: string;
  material: string;
  payment: string;
};

type OwnershipAgent = Awaited<ReturnType<typeof registerAndLogin>>;

export const ownershipRoutes: OwnershipRoute[] = [
  { method: "GET", path: "/clients/:id", target: "client" },
  {
    method: "PATCH",
    path: "/clients/:id",
    target: "client",
    body: { name: "Changed" },
  },
  { method: "DELETE", path: "/clients/:id", target: "client" },
  { method: "GET", path: "/clients/:id/jobs", target: "client" },
  {
    method: "POST",
    path: "/clients/:id/jobs",
    target: "client",
    body: makeJob(),
  },
  { method: "GET", path: "/jobs/:id", target: "job" },
  { method: "PATCH", path: "/jobs/:id", target: "job", body: makeJob() },
  { method: "DELETE", path: "/jobs/:id", target: "job" },
  {
    method: "POST",
    path: "/jobs/:id/materials",
    target: "job",
    body: makeMaterial(),
  },
  { method: "GET", path: "/jobs/:id/materials", target: "job" },
  {
    method: "PATCH",
    path: "/materials/:id",
    target: "material",
    body: makeMaterial(),
  },
  { method: "DELETE", path: "/materials/:id", target: "material" },
  { method: "GET", path: "/jobs/:id/payments", target: "job" },
  {
    method: "POST",
    path: "/jobs/:id/payments",
    target: "job",
    body: makePayment(),
  },
  {
    method: "PATCH",
    path: "/payment/:id",
    target: "payment",
    body: makePayment(),
  },
  { method: "DELETE", path: "/payment/:id", target: "payment" },
];

export const ownershipExempt: {
  method: string;
  path: string;
  reason: string;
}[] = [];

export function sendRequest(
  agent: OwnershipAgent,
  method: RouteMethod,
  path: string,
  body?: object,
) {
  switch (method) {
    case "GET":
      return agent.get(path).send(body);
    case "PATCH":
      return agent.patch(path).send(body);
    case "POST":
      return agent.post(path).send(body);
    case "DELETE":
      return agent.delete(path).send(body);
  }
}

export function buildPaths(row: OwnershipRoute, ids: OwnershipIds) {
  const id = ids[row.target];
  return {
    foreign: row.path.replace(":id", id),
    missing: row.path.replace(":id", nonexistentId),
    malformed: row.path.replace(":id", malformedId),
  };
}

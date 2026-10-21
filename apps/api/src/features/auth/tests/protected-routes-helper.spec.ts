import express from "express";
import { describe, expect, it } from "vitest";
import { collectRoutes, routeKey } from "./protected-routes-helper.ts";

describe("protected route helpers", () => {
  it("collects every method registered on a local router", () => {
    const router = express.Router();
    router.get("/one", () => {});
    router.put("/two", () => {});
    router.patch("/three", () => {});

    expect(collectRoutes(router)).toEqual([
      { method: "GET", path: "/one" },
      { method: "PUT", path: "/two" },
      { method: "PATCH", path: "/three" },
    ]);
  });

  it("rejects nested routers", () => {
    const router = express.Router();
    const nestedRouter = express.Router();
    router.use("/nested", nestedRouter);

    expect(() => collectRoutes(router)).toThrow(
      "nested routers not supported, extend collectRoutes to track mount prefixes",
    );
  });

  it('formats route keys as "METHOD /path"', () => {
    expect(routeKey({ method: "GET", path: "/one" })).toBe("GET /one");
  });
});

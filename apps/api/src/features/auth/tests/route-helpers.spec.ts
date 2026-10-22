import express from "express";
import { describe, expect, it } from "vitest";
import { collectAppRoutes, collectRoutes, routeKey } from "./route-helpers.ts";

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

  it("collects routes from an app and a router mounted at root", () => {
    const app = express();
    const router = express.Router();
    router.get("/router-route", () => {});
    app.use("/", router);
    app.get("/app-route", () => {});

    expect(collectAppRoutes(app)).toEqual([
      { method: "GET", path: "/router-route" },
      { method: "GET", path: "/app-route" },
    ]);
  });

  it("rejects a router nested inside a root-mounted router", () => {
    const app = express();
    const router = express.Router();
    const nestedRouter = express.Router();
    nestedRouter.get("/nested-route", () => {});
    router.use("/", nestedRouter);
    app.use("/", router);

    expect(() => collectAppRoutes(app)).toThrow(
      "nested routers not supported, extend collectRoutes to track mount prefixes",
    );
  });

  it('formats route keys as "METHOD /path"', () => {
    expect(routeKey({ method: "GET", path: "/one" })).toBe("GET /one");
  });
});

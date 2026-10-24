import type {
  Application,
  ILayer,
  IRouter,
  IRoute,
} from "express-serve-static-core";

/** A method and path pair used to compare registered and classified routes. */
export type RouteRow = {
  method: string;
  path: string;
};

/** The Express route shape needed to enumerate its registered methods. */
type RouteWithMethods = IRoute & {
  methods: Record<string, boolean>;
};

/**
 * Identifies mounted routers so collectRoutes can reject nesting rather than
 * losing the mount prefix while inspecting the router stack.
 */
export function hasRouterStack(handle: ILayer["handle"]): handle is IRouter {
  return typeof handle === "function" && "stack" in handle;
}

/**
 * Identifies route layers whose methods can be enumerated by collectRoutes.
 */
export function hasRouteMethods(
  route: ILayer["route"],
): route is RouteWithMethods {
  return route !== undefined && "methods" in route;
}

function collectRouteRows(layer: ILayer): RouteRow[] {
  if (!hasRouteMethods(layer.route)) {
    return [];
  }

  return Object.keys(layer.route.methods)
    .filter((method) => method !== "_all")
    .map((method) => ({
      method: method.toUpperCase(),
      path: String(layer.route?.path ?? ""),
    }));
}

export function collectRoutes(router: IRouter): RouteRow[] {
  return router.stack.flatMap((layer) => {
    if (hasRouterStack(layer.handle)) {
      throw new Error(
        "nested routers not supported, extend collectRoutes to track mount prefixes",
      );
    }

    return collectRouteRows(layer);
  });
}

export function collectAppRoutes(app: Application): RouteRow[] {
  return app.router.stack.flatMap((layer) => {
    if (hasRouterStack(layer.handle)) {
      // Top-level routers are mounted at "/" in this application.
      return collectRoutes(layer.handle);
    }

    return collectRouteRows(layer);
  });
}

export function routeKey(route: RouteRow) {
  return `${route.method} ${route.path}`;
}

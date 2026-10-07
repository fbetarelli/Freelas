import type { Application } from "express";
import { express } from "./express.ts";
import { routes } from "./routes.ts";
import { packages } from "./packages.ts";

export const loaders = (app: Application) => {
  express(app);
  packages(app);
  routes(app);
};

import type { Application } from "express";
import { express } from "./express.ts";
import { routes } from "./routes.ts";
import { frontend } from "./frontend.ts";
import { packages } from "./packages.ts";

export const loaders = (app: Application) => {
  express(app);
  packages(app);
  frontend(app);
  routes(app);
};

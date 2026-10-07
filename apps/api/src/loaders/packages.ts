import type { Application } from "express";
import helmet from "helmet";
import logger from "morgan";

export const packages = (app: Application) => {
  app.use(logger("dev"));
  app.use(helmet());
};

import type { Application } from "express";
import helmet from "helmet";
import logger from "morgan";
import flash from "connect-flash";

export const packages = (app: Application) => {
  app.use(logger("dev"));
  app.use(flash());
  app.use(helmet());
};

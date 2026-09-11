import { type Application, static as exStatic } from "express";
import { join } from "path";

export const frontend = (app: Application) => {
  app.set("view engine", "ejs");
  app.set("views", join(import.meta.dirname, "..", "views"));
  app.use(exStatic(join(import.meta.dirname, "..", "..", "public")));
};

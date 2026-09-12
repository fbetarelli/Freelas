import { json, urlencoded, type Application } from "express";
import session from "express-session";

export const express = (app: Application) => {
  //Body parser
  app.use(urlencoded({ extended: true }));
  app.use(json());

  //Session
  app.use(
    session({
      secret: process.env.SESSION_SECRET ?? "stealthy-secret",
      saveUninitialized: true,
      resave: true,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 30, // um ano
      },
    }),
  );
};

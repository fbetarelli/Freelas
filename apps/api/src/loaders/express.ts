import cookieParser from "cookie-parser";
import cors from "cors";
import { json, urlencoded, type Application } from "express";
import { getAuthConfig } from "../features/auth/config.ts";

export const express = (app: Application) => {
  const { CLIENT_ORIGIN } = getAuthConfig();

  //Body parser
  app.use(urlencoded({ extended: true }));
  app.use(json());

  app.use(cookieParser());

  app.use(
    cors({
      origin: CLIENT_ORIGIN,
      credentials: true, // Allows browser to attach cookies
    }),
  );
};

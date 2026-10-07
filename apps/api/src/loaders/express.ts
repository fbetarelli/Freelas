import cookieParser from "cookie-parser";
import cors from "cors";
import { json, urlencoded, type Application } from "express";

export const express = (app: Application) => {
  //Body parser
  app.use(urlencoded({ extended: true }));
  app.use(json());

  app.use(cookieParser());

  app.use(
    cors({
      origin: process.env.CLIENT_ORIGIN || "http://localhost:3000", // Match frontend URL
      credentials: true, // Allows browser to attach cookies
    }),
  );
};

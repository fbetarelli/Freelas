import type { Application, ErrorRequestHandler } from "express";

export class CustomError extends Error {
  code: number;
  customMessage: string;

  constructor(code: number, customMessage: string) {
    super();
    this.code = code;
    this.customMessage = customMessage;
  }
}

export const errorHandler = (app: Application) => {
  const errorHandlerMiddleware: ErrorRequestHandler = (
    err: CustomError,
    _req,
    res,
    //eslint-disable-next-line
    _next,
  ) => {
    console.error(err);

    res.status(500).render("erro", {
      title: err.code ?? "500",
      message: err.customMessage ?? "Indeterminado",
    });
  };

  app.use(errorHandlerMiddleware);
};

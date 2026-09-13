import type { Application, ErrorRequestHandler } from "express";

export class ApiError extends Error {
  public readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string = "Resource not found") {
    super(404, message);
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message: string = "Unauthorized access") {
    super(401, message);
  }
}

export class BadRequestError extends ApiError {
  constructor(message: string = "Bad request") {
    super(400, message);
  }
}

export class ForbiddenError extends ApiError {
  constructor(message: string = "Forbidden access") {
    super(403, message);
  }
}

export const errorHandler = (app: Application) => {
  const errorHandlerMiddleware: ErrorRequestHandler = (
    err: ApiError | Error,
    _req,
    res,
    //eslint-disable-next-line
    _next,
  ) => {
    if (err instanceof ApiError) {
      return res.status(err.status).json({
        message: err.message,
      });
    }
    console.error(err);
    res.status(500).json({
      message: "Internal server error",
    });
  };

  app.use(errorHandlerMiddleware);
};

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

export class ConflictError extends ApiError {
  constructor(message: string) {
    super(409, message);
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
    if (isPgError(err)) {
      if (err.code === "23505") {
        return res
          .status(409)
          .json({ message: err.detail ?? "Duplicate entry" });
      }
      if (err.code === "23503") {
        return res
          .status(400)
          .json({
            message: err.detail ?? "Referenced resource does not exist",
          });
      }
    }
    console.error(err);
    res.status(500).json({
      message: "Internal server error",
    });
  };

  app.use(errorHandlerMiddleware);
};

function isPgError(
  err: unknown,
): err is { code: string; detail?: string; constraint?: string } {
  return typeof err === "object" && err !== null && "code" in err;
}

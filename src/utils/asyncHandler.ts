import {
  type NextFunction,
  type Request,
  type RequestHandler,
  type Response,
} from "express";
import "express-session";

//Função que trata erros do controller sem precisar utilizar um trycatch toda vez
export function asyncHandler(
  controllerFunction: RequestHandler,
): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(controllerFunction(req, res, next)).catch((err) =>
      next(err),
    );
  };
}

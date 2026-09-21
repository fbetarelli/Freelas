import { BadRequestError } from "../entities/errors/errors.ts";

export function assertIsString(
  value: unknown,
  paramName: string,
): asserts value is string {
  if (typeof value !== "string") {
    throw new BadRequestError(`Invalid route parameter: ${paramName}`);
  }
}

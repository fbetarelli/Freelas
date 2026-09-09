export function assertIsString(value: unknown, paramName: string): asserts value is string {
  if (typeof value !== "string") {
    throw new Error(`Invalid route parameter: ${paramName}`);
  }
}
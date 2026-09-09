export class CustomError extends Error {
  code: number;
  customMessage: string;

  constructor(code: number, customMessage: string) {
    super();
    this.code = code;
    this.customMessage = customMessage;
  }
}

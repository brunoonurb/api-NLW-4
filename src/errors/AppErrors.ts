export class AppError {
  public readonly message: string;
  public readonly statusCode: number;
  public readonly error: object;

  constructor(message: string, error?: object, statusCode = 400,) {
    this.message = message;
    this.statusCode = statusCode;
    this.error = error;
  }
}

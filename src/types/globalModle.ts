export class BrigeError extends Error {
  public status: number;
  public type: BridgeErrorType;

  constructor(
    type: BridgeErrorType = "UNKNOWN_ERROR",
    message: string,
    statusCode = 400
  ) {
    super(message);
    this.name = "UploadError";
    this.type = type;
    this.status = statusCode;
  }
}

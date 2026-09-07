export class SignalError extends Error {
  public status: number;
  public code?: string;
  private timestamp: string;

  constructor(
    message: string,
    status: number,
    timestamp: string,
    code?: string,
  ) {
    super(message);
    this.status = status;
    this.timestamp = timestamp;
    this.code = code;
  }

  public getTime(): Date {
    return new Date(this.timestamp);
  }
}

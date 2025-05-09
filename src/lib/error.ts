export class SignalError extends Error {
  public status: number;
  private timestamp: string;

  constructor(message: string, status: number, timestamp: string) {
    super(message);
    this.status = status;
    this.timestamp = timestamp;
  }

  public getTime(): Date {
    return new Date(this.timestamp);
  }
}

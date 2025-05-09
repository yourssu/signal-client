export type SignalResponse<T> = SuccessResponse<T> | ErrorResponse;
export interface SuccessResponse<T> {
  timestamp: string;
  result: T;
}

export interface ErrorResponse {
  timestamp: string;
  status: number;
  message: string;
}

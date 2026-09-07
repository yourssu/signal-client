export type SignalResponse<T> = SuccessResponse<T> | ErrorResponse;
export interface SuccessResponse<T> {
  timestamp: string;
  result: T;
}

export interface ErrorResponse {
  timestamp: string;
  status: number;
  message: string;
  /** 서버가 실패 사유를 구분해 주는 코드. 401처럼 코드가 없는 응답도 있다. */
  code?: string;
}

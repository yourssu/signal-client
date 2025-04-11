export interface ViewersFoundRequestParams {
  secretKey: string;
}

export interface VerificationRequestParams {
  uuid: string;
}

export interface TicketCreatedRequest {
  secretKey: string;
  verificationCode: number;
  ticket: number;
}

export interface VerificationResponse {
  verificationCode: string;
}

export interface ViewerResponse {
  id?: number;
  uuid: string;
  ticket: number;
  usedTicket: number;
  updatedDate: string;
}

import { ProfileContactResponse } from "@/types/profile";

export interface FullProfileResponse extends ProfileContactResponse {
  uuid: string;
}

export interface TicketIssuedRequest {
  secretKey: string;
  verificationCode: number;
  ticket: number;
}

export interface ViewersFoundRequestParams {
  secretKey: string;
}

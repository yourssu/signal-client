import { Gender, ProfileContactResponse } from "@/types/profile";

export interface VerificationRequestParams {
  uuid: string;
  gender: Gender;
}

export interface VerificationResponse {
  verificationCode: number;
}

export interface ViewerSelfRequest {
  uuid: string;
}

export interface PurchasedProfileResponse extends ProfileContactResponse {
  createdTime: string;
}

export interface ViewerResponse {
  id: number;
  uuid: string;
  gender: Gender;
  ticket: number;
  usedTicket: number;
  updatedDate: string;
}

export interface ViewerDetailResponse extends ViewerResponse {
  purchasedProfiles: PurchasedProfileResponse[];
}

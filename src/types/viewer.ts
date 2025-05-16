import { Gender, ProfileContactResponse } from "@/types/profile";

export interface VerificationRequestParams {
  uuid: string;
  gender: Gender;
}

export interface Package {
  id: string;
  name: string;
  quantity: [number, number]; // Discounted, Original
  price: [number, number];
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
  ticket: number;
  usedTicket: number;
  updatedTime: string;
}

export interface ViewerDetailResponse extends ViewerResponse {
  purchasedProfiles: PurchasedProfileResponse[];
}

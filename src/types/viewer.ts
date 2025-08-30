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

export interface NotificationDepositRequest {
  message: string;
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

export interface PurchasedProfileResponse {
  profileId: number;
  createdTime: string;
}

export interface ViewerDetailResponse extends ViewerResponse {
  purchasedProfiles: PurchasedProfileResponse[];
}

export interface ViewerDetailResponse extends ViewerResponse {
  purchasedProfiles: PurchasedProfileResponse[];
}

// Payment related types
export interface PaymentInitiationRequest {
  quantity: number;
  price: number;
}

export interface PaymentInitiationResponse {
  orderId: string;
  nextRedirectPcUrl: string;
  nextRedirectMobileUrl: string;
}

export interface PaymentApprovalRequest {
  orderId: string;
  pgToken: string;
}

export interface PaymentCompletionResponse {
  orderId: string;
  itemName: string;
  amount: number;
  approvedTime: string;
}

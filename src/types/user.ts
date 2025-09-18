import {
  Gender,
  ProfileContactResponse,
  ProfileResponse,
} from "@/types/profile";
import { PurchasedProfileResponse, ViewerResponse } from "@/types/viewer";

export interface UserInfoResponse {
  uuid: string;
}

export interface UserData {
  uuid: string | null;
  isFirstProfileView: boolean;
  lastEntranceTime: number | null;
  gender: Gender | null;
  viewer: ViewerResponse | null;
  profile: ProfileContactResponse | null;
  purchasedProfiles: PurchasedProfileResponse[] | null;
  savedProfiles: ProfileResponse[] | null;
  recentlyViewedProfileIds: string[];
}

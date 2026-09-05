import { AnimalType, Gender } from "@/types/profile";

export type MeetingSlot =
  | "SLOT_1"
  | "SLOT_2"
  | "SLOT_3"
  | "SLOT_4"
  | "SLOT_5"
  | "SLOT_6"
  | "SLOT_7";

export type MeetingRoomStatus = "OPEN" | "MATCHED" | "CANCELLED" | "EXPIRED";

export type MeetingTeamSide = "CREATOR" | "APPLICANT";

export interface MeetingMemberRequest {
  gender: Gender;
  birthYear: number;
  department: string;
}

export interface MeetingMemberResponse {
  teamSide: MeetingTeamSide;
  memberOrder: number;
  gender: Gender;
  birthYear: number;
  department: string;
}

export interface MeetingRoomSummaryResponse {
  id: number;
  partySize: number;
  invitation: string;
  expiresAt: string;
  creatorAnimal: AnimalType;
}

export interface MeetingRoomResponse extends MeetingRoomSummaryResponse {
  slot: MeetingSlot;
  status: MeetingRoomStatus;
}

export interface MeetingRoomDetailResponse {
  room: MeetingRoomResponse;
  members: MeetingMemberResponse[];
}

export type MeetingCreationBlockReason =
  | "PROFILE_REQUIRED"
  | "DAILY_CREATION_LIMIT_EXCEEDED"
  | "DAILY_MEETING_LIMIT_EXCEEDED";

export interface MeetingCreationEligibilityResponse {
  canCreate: boolean;
  reason?: MeetingCreationBlockReason | null;
}

export interface MeetingSlotResponse {
  slot: MeetingSlot;
  room?: MeetingRoomSummaryResponse | null;
}

export interface MeetingLatestMatchResponse {
  roomId: number;
  creatorNickname: string;
  creatorAnimal: AnimalType;
  matchedAt: string;
  visibleUntil: string;
}

export interface MeetingBoardResponse {
  creationEligibility: MeetingCreationEligibilityResponse;
  slots: MeetingSlotResponse[];
  latestMatch?: MeetingLatestMatchResponse | null;
}

export interface MeetingRoomCreateRequest {
  slot: MeetingSlot;
  invitation: string;
  companions: MeetingMemberRequest[];
}

export interface MeetingMatchRequest {
  representative: MeetingMemberRequest;
  contact: string;
  companions: MeetingMemberRequest[];
}

export interface MeetingMatchResponse {
  roomId: number;
  status: MeetingRoomStatus;
  counterpartContact: string;
}

export interface MeetingResultResponse {
  roomId: number;
  counterpartContact: string;
}

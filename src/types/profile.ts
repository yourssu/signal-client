export interface ProfileCreatedRequest {
  gender: string;
  animal: string;
  contact: string;
  mbti: string;
  nickname: string;
}

export interface NicknameGeneratedRequest {
  description: string[];
}

export interface ProfileFoundRequestParams {
  uuid: string;
}

export interface TicketConsumedRequest {
  profileId: number;
  uuid: string;
}

export interface NicknameCreatedResponse {
  nickname: string;
}

export interface ProfileResponse {
  profileId?: number;
  gender: string;
  animal: string;
  mbti: string;
  nickname: string;
}

export interface ProfileContactResponse extends ProfileResponse {
  contact: string;
}

export type Gender = "MALE" | "FEMALE";
export type AnimalType = "DOG" | "BEAR" | "DINOSAUR" | "WOLF" | "DEER" | "CAT";
export interface ProfileCreatedRequest {
  gender: Gender;
  animal: AnimalType;
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
  gender: Gender;
  animal: AnimalType;
  mbti: string;
  nickname: string;
}

export interface ProfileContactResponse extends ProfileResponse {
  contact: string;
}

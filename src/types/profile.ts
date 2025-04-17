export type Gender = "MALE" | "FEMALE";
export type AnimalType = "DOG" | "BEAR" | "DINOSAUR" | "WOLF" | "DEER" | "CAT";
export interface ProfileCreatedRequest {
  uuid?: string;
  gender: Gender;
  animal: AnimalType;
  contact: string;
  mbti: string;
  // maximum 15 characters
  nickname: string;
  introSentences: string[];
}

export interface NicknameGeneratedRequest {
  introSentences: string[];
}

export interface ProfileFoundRequestParams {
  uuid: string;
}

/**
 * /profile/random
 */
export interface RandomProfileRequestParams {
  uuid: string;
  excludeProfiles: number[];
}

export interface TicketConsumedRequest {
  profileId: number;
  uuid: string;
}

export interface NicknameCreatedResponse {
  nickname: string;
}

export interface ProfileResponse {
  profileId: number;
  gender: Gender;
  animal: AnimalType;
  mbti: string;
  nickname: string;
  introSentences: string[];
}

export interface ProfileContactResponse extends ProfileResponse {
  contact: string;
}

export type Gender = "MALE" | "FEMALE";
export type AnimalType =
  | "DOG"
  | "BEAR"
  | "DINOSAUR"
  | "HAMSTER"
  | "DEER"
  | "CAT"
  | "FOX"
  | "TURTLE"
  | "RABBIT";
export type Mbti = `${"E" | "I"}${"N" | "S"}${"F" | "T"}${"J" | "P"}`;
export interface ProfileCreatedRequest {
  uuid?: string;
  gender: Gender;
  department: string;
  birthYear: number;
  animal: AnimalType;
  contact: string;
  mbti: Mbti;
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

export interface ProfileCountResponse {
  count: number;
}

export interface NicknameCreatedResponse {
  nickname: string;
}

export interface ProfileResponse {
  profileId: number;
  gender: Gender;
  department: string;
  birthYear: number;
  animal: AnimalType;
  mbti: Mbti;
  nickname: string;
  introSentences: string[];
}

export interface ProfileContactResponse extends ProfileResponse {
  contact: string;
}

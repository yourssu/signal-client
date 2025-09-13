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
  school: string | null;
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
  gender: Gender;
  excludeProfiles: number[];
}

export interface TicketConsumedRequest {
  profileId: number;
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
  school: string | null;
}

export interface MyProfileResponse {
  profileId: number;
  uuid: string;
  gender: Gender;
  department: string;
  birthYear: number;
  animal: AnimalType;
  contact: string;
  mbti: Mbti;
  nickname: string;
  introSentences: string[];
  school: string;
}

export interface ProfileContactResponse extends ProfileResponse {
  contact: string;
}

export interface ProfileUpdateRequest {
  nickname: string;
  introSentences: string[];
  contact: string;
}

export interface ProfileRankingResponse {
  /** 본인의 순위, 동률이라면 낮은 숫자로 */
  rank: number;
  /** 사용자 성별의 총 프로필 수 */
  totalProfiles: number;
  /** 사용자 프로필 열람 수 */
  purchaseCount: number;
  /** 사용자 성별 */
  gender: Gender;
  department: string;
  birthYear: number;
  animal: AnimalType;
  mbti: Mbti;
  nickname: string;
  introSentences: string[];
  school: string;
}

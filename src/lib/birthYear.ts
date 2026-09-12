/**
 * 입력받는 출생연도 범위.
 *
 * 서버는 1900~2026을 받지만(ProfileCreatedRequest·MeetingMemberRequest) 그건
 * 형식 검사에 가깝다. 실제 이용자 나이대는 이 범위라, 프로필 등록과 미팅
 * 참여자 입력이 같은 기준을 쓴다.
 */
export const MIN_BIRTH_YEAR = 1985;
export const MAX_BIRTH_YEAR = 2008;

export const isValidBirthYear = (birthYear: number | null): boolean =>
  birthYear !== null &&
  birthYear >= MIN_BIRTH_YEAR &&
  birthYear <= MAX_BIRTH_YEAR;

/** 범위를 문구에 박지 않는다. 상수를 고치면 두 화면의 안내가 같이 따라와야 한다. */
export const BIRTH_YEAR_ERROR_TEXT = `${MIN_BIRTH_YEAR}년생부터 ${MAX_BIRTH_YEAR}년생까지 입력할 수 있어요`;

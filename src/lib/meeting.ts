import avatarBear from "@/assets/lobby/avatar_bear.svg";
import avatarCat from "@/assets/lobby/avatar_cat.svg";
import avatarDeer from "@/assets/lobby/avatar_deer.svg";
import avatarDinosaur from "@/assets/lobby/avatar_dinosaur.svg";
import avatarDog from "@/assets/lobby/avatar_dog.svg";
import avatarFox from "@/assets/lobby/avatar_fox.svg";
import avatarHamster from "@/assets/lobby/avatar_hamster.svg";
import avatarRabbit from "@/assets/lobby/avatar_rabbit.svg";
import avatarTurtle from "@/assets/lobby/avatar_turtle.svg";
import avatarWolf from "@/assets/lobby/avatar_wolf.svg";
import type {
  MeetingCreationBlockReason,
  MeetingErrorCode,
  MeetingMemberResponse,
  MeetingMyRoomResponse,
  MeetingRoomResponse,
  MeetingRoomSummaryResponse,
  MeetingSlot,
} from "@/types/meeting";
import type { AnimalType } from "@/types/profile";

export interface SlotPosition {
  left: string;
  top: string;
}

/**
 * 맵 레이어(배경 이미지 박스) 기준 퍼센트 좌표.
 * 원본 375x810 프레임의 절대좌표를 배경 박스(387.113x960.766, 오프셋 -6.056/-130.877)
 * 기준으로 환산한 값이며, 마커 중심 기준이라 -translate-x-1/2과 함께 쓴다.
 */
export const SLOT_POSITIONS: Record<MeetingSlot, SlotPosition> = {
  SLOT_1: { left: "50.072%", top: "39.331%" },
  SLOT_2: { left: "81.055%", top: "44.431%" },
  SLOT_3: { left: "19.977%", top: "44.431%" },
  SLOT_4: { left: "50.072%", top: "50.364%" },
  SLOT_5: { left: "81.055%", top: "55.777%" },
  SLOT_6: { left: "19.977%", top: "55.777%" },
  SLOT_7: { left: "50.072%", top: "61.398%" },
};

/** 응답이 슬롯을 누락하거나 순서를 바꿔도 7개를 모두 그리기 위한 기준 목록. */
export const MEETING_SLOTS = Object.keys(SLOT_POSITIONS) as MeetingSlot[];

export const MEETING_CREATION_BLOCK_MESSAGES: Record<
  MeetingCreationBlockReason,
  string
> = {
  PROFILE_REQUIRED: "프로필을 먼저 등록해주세요",
  MEETING_BLOCKED: "지금은 미팅을 이용할 수 없어요",
  DAILY_CREATION_LIMIT_EXCEEDED: "오늘 만들 수 있는 방을 모두 사용했어요",
  DAILY_MEETING_LIMIT_EXCEEDED:
    "오늘은 더 참여할 수 없어요. 내일 다시 시도해주세요",
  ACTIVE_ROOM_EXISTS: "이미 참여 중인 방이 있어요",
};

export const MEETING_ERROR_MESSAGES: Record<MeetingErrorCode, string> = {
  PROFILE_REQUIRED: "프로필을 먼저 등록해주세요",
  MEETING_BLOCKED: "지금은 미팅을 이용할 수 없어요",
  DAILY_CREATION_LIMIT_EXCEEDED: "오늘 만들 수 있는 방을 모두 사용했어요",
  DAILY_MEETING_LIMIT_EXCEEDED:
    "오늘은 더 참여할 수 없어요. 내일 다시 시도해주세요",
  ACTIVE_ROOM_EXISTS: "이미 참여 중인 방이 있어요",
  SLOT_ALREADY_OCCUPIED: "잠깐 사이 방이 찼어요. 다른 위치를 선택해주세요",
  SELF_MATCH_NOT_ALLOWED: "내가 만든 방에는 참여할 수 없어요",
  ROOM_ALREADY_MATCHED: "이미 매칭이 끝난 방이에요",
  ROOM_CANCELLED: "삭제된 방이에요",
  ROOM_EXPIRED: "종료된 방이에요",
  MEETING_ROOM_NOT_FOUND: "방을 찾을 수 없어요",
  MEETING_ROOM_CANCEL_FORBIDDEN: "방장만 방을 삭제할 수 있어요",
  MEETING_RESULT_FORBIDDEN: "매칭 당사자만 볼 수 있어요",
  INVALID_MEETING_SLOT: "다른 위치를 선택해주세요",
  INVALID_MEETING_INVITATION: "만나서 할 일을 다시 입력해주세요",
  INVALID_MEETING_MEMBER: "인원 정보를 다시 확인해주세요",
  INVALID_COMPANION_COUNT: "인원 수가 방과 맞지 않아요",
};

/** 서버가 코드를 주지 않거나 모르는 코드를 줄 수 있으므로 문구를 보장한다. */
export const getMeetingErrorMessage = (
  code: string | undefined,
  fallback: string,
): string =>
  (code ? MEETING_ERROR_MESSAGES[code as MeetingErrorCode] : undefined) ??
  fallback;

/**
 * 내가 만든 방이 아직 모집 중이면 서버가 다른 방 참여를 막는다.
 *
 * 스펙의 409 설명이 "생성한 방 진행 중"이라 매칭까지 끝난 방도 막히는지는 확인되지 않았다.
 * 잘못 막으면 참여할 수 있는 사람을 막게 되므로 확실한 경우만 미리 알린다.
 */
export const getJoinBlockedReason = (
  myRoom: MeetingMyRoomResponse | null | undefined,
): MeetingErrorCode | null =>
  myRoom?.teamSide === "CREATOR" && myRoom.status === "OPEN"
    ? "ACTIVE_ROOM_EXISTS"
    : null;

/**
 * 참여할 수 없게 된 사유를 서버가 409로 줄 코드와 같은 값으로 돌려준다.
 * 아직 열려 있으면 null이다.
 *
 * 서버는 끝난 방도 200으로 내려주므로 조회가 성공했다는 것만으로는 참여할 수 있다는 뜻이
 * 아니다. 이걸 보지 않으면 인원을 다 채운 뒤에야 거절당한다.
 */
export const getRoomEndedReason = (
  room: Pick<MeetingRoomResponse, "status" | "expiresAt">,
  now: number,
): MeetingErrorCode | null => {
  if (room.status === "MATCHED") return "ROOM_ALREADY_MATCHED";
  if (room.status === "CANCELLED") return "ROOM_CANCELLED";
  if (room.status === "EXPIRED") return "ROOM_EXPIRED";
  // 서버가 걷어가기 전이라 status는 아직 OPEN이어도 시간이 지났으면 끝난 방이다.
  if (new Date(room.expiresAt).getTime() <= now) return "ROOM_EXPIRED";
  return null;
};

/** 미팅에 쓸 수 있는 연락처. 전화번호이거나 인스타 핸들이다. */
const MEETING_CONTACT_REGEX = /^(?:010[2-9]\d{7}|@[a-zA-Z0-9._]{1,30})$/;

export const isMeetingContact = (contact: string): boolean =>
  MEETING_CONTACT_REGEX.test(contact);

/** 잔여 시간이 이 값 이하로 떨어지면 방 종료 임박 안내를 띄운다. */
export const MEETING_ROOM_EXPIRY_WARNING_MS = 60_000;

/** 가운뎃점 U+00B7. 생김새가 거의 같은 U+2219로 흘러간 적이 있어 한곳에 묶어 둔다. */
export const MEMBER_PART_SEPARATOR = "·";

/**
 * 멤버를 화면에 쓸 조각으로 나눈다. 행·칩으로 마크업이 갈려
 * 문자열 하나로 합치면 조각 사이 간격을 줄 수 없다.
 */
export const getMemberSummaryParts = (
  member: Pick<MeetingMemberResponse, "gender" | "birthYear" | "department">,
): string[] => [
  member.department,
  `${String(member.birthYear % 100).padStart(2, "0")}년생`,
  member.gender === "MALE" ? "남" : "여",
];

/**
 * 남은 밀리초를 초로 내린다. 파싱 실패는 0으로 떨어뜨린다.
 *
 * 세 화면이 같은 방의 남은 시간을 동시에 보여주므로 버림 하나로 통일한다.
 * 올리거나 반올림하면 상세 시트가 "43분 52초"일 때 로비 마커가 "44분"이 된다.
 */
const toRemainingSeconds = (remainingMs: number): number =>
  Number.isFinite(remainingMs)
    ? Math.max(0, Math.floor(remainingMs / 1000))
    : 0;

/** 남은 시간을 mm:ss로. */
export const formatCountdown = (remainingMs: number): string => {
  const totalSeconds = toRemainingSeconds(remainingMs);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

/** 상세 시트용 "43분 52초". */
export const formatRemainingDetail = (remainingMs: number): string => {
  const totalSeconds = toRemainingSeconds(remainingMs);
  return `${Math.floor(totalSeconds / 60)}분 ${totalSeconds % 60}초`;
};

/** 기준 시각을 받는다. 내부에서 시계를 읽으면 리렌더 없이는 값이 갱신되지 않는다. */
export const formatRemainingTime = (expiresAt: string, now: number): string => {
  const remainingMs = new Date(expiresAt).getTime() - now;
  if (remainingMs <= 0) return "마감";
  // 버림이라 마지막 1분은 "0분 남음"이 된다. 만료 임박 안내 구간과 같은 경계다.
  if (remainingMs < MEETING_ROOM_EXPIRY_WARNING_MS) return "1분 미만";
  return `${Math.floor(remainingMs / 60_000)}분 남음`;
};

export const MEETING_AVATARS: Record<AnimalType, string> = {
  HAMSTER: avatarHamster,
  CAT: avatarCat,
  DOG: avatarDog,
  WOLF: avatarWolf,
  FOX: avatarFox,
  BEAR: avatarBear,
  DEER: avatarDeer,
  TURTLE: avatarTurtle,
  DINOSAUR: avatarDinosaur,
  RABBIT: avatarRabbit,
};

export const getSlotAvatar = (room: MeetingRoomSummaryResponse): string =>
  MEETING_AVATARS[room.creatorAnimal];

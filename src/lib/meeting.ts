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

const MEETING_ERROR_MESSAGES: Record<MeetingErrorCode, string> = {
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

/** 남은 시간을 mm:ss로. 파싱 실패는 00:00으로 떨어뜨린다. */
export const formatCountdown = (remainingMs: number): string => {
  const totalSeconds = Number.isFinite(remainingMs)
    ? Math.max(0, Math.round(remainingMs / 1000))
    : 0;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

/** 기준 시각을 받는다. 내부에서 시계를 읽으면 리렌더 없이는 값이 갱신되지 않는다. */
export const formatRemainingTime = (expiresAt: string, now: number): string => {
  const remainingMs = new Date(expiresAt).getTime() - now;
  if (remainingMs <= 0) return "마감";
  return `${Math.ceil(remainingMs / 60_000)}분 남음`;
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

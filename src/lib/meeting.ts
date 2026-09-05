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
import type { MeetingRoomSummaryResponse } from "@/types/meeting";
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
export const SLOT_POSITIONS: SlotPosition[] = [
  { left: "50.072%", top: "39.331%" },
  { left: "81.055%", top: "44.431%" },
  { left: "19.977%", top: "44.431%" },
  { left: "50.072%", top: "50.364%" },
  { left: "81.055%", top: "55.777%" },
  { left: "19.977%", top: "55.777%" },
  { left: "50.072%", top: "61.398%" },
];

export const formatRemainingTime = (expiresAt: string): string => {
  const remainingMs = new Date(expiresAt).getTime() - Date.now();
  if (remainingMs <= 0) return "마감";
  return `${Math.ceil(remainingMs / 60_000)}분 남음`;
};

const MEETING_AVATARS: Record<AnimalType, string> = {
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

import { Mbti } from "@/types/profile";

const MBTI_VALID_CHARS: string[][] = [
  ["E", "I"],
  ["S", "N"],
  ["T", "F"],
  ["J", "P"],
];

export const isValidMbti = (mbti: string): mbti is Mbti => {
  if (typeof mbti !== "string" || mbti.length !== 4) return false;
  const upperMbti = mbti.toUpperCase();
  for (let i = 0; i < 4; i++) {
    if (!MBTI_VALID_CHARS[i].includes(upperMbti[i])) {
      return false;
    }
  }
  return true;
};

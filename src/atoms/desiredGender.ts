import { Gender } from "@/types/profile";
import { atomWithStorage } from "jotai/utils";

export const desiredGenderAtom = atomWithStorage<Gender | null>(
  "viewer.desiredGender",
  null,
  undefined,
  { getOnInit: true }
);

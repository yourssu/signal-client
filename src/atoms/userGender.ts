import { Gender } from "@/types/profile";
import { atomWithStorage } from "jotai/utils";

export const userGenderAtom = atomWithStorage<Gender | null>(
  "user.gender",
  null,
  undefined,
  { getOnInit: true },
);

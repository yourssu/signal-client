import { Gender } from "@/types/profile";
import { atomWithStorage } from "jotai/utils";

export const userGender = atomWithStorage<Gender | null>(
  "user.gender",
  null,
  undefined,
  { getOnInit: true }
);

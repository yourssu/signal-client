import { ProfileContactResponse } from "@/types/profile";
import { atomWithStorage } from "jotai/utils";

export const userProfileAtom = atomWithStorage<ProfileContactResponse | null>(
  "user.profile",
  null,
  undefined,
  { getOnInit: true }
);

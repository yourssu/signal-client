import { Gender } from "@/types/profile";
import { atomWithStorage } from "jotai/utils";
import { clearTokensAtom } from "@/atoms/authTokens";
import {
  purchasedProfilesAtom,
  recentlyViewedProfilesAtom,
  savedProfilesAtom,
} from "@/atoms/profiles";
import { ViewerResponse } from "@/types/viewer";
import { DATA_EXPIRY } from "@/env";
import { atom } from "jotai";
import { ProfileContactResponse } from "@/types/profile";

export const userGenderAtom = atomWithStorage<Gender | null>(
  "user.gender",
  null,
  undefined,
  { getOnInit: true },
);

export const userProfileAtom = atomWithStorage<ProfileContactResponse | null>(
  "user.profile",
  null,
  undefined,
  { getOnInit: true },
);

export const isFirstProfileViewAtom = atomWithStorage<boolean>(
  "user.isFirstProfileView",
  true,
  undefined,
  { getOnInit: true },
);
export const lastEntranceAtom = atomWithStorage<number | null>(
  "user.lastEntranceTime",
  null,
  undefined,
  { getOnInit: true },
);

export const viewerAtom = atomWithStorage<ViewerResponse | null>(
  "user.viewerInfo",
  null,
  undefined,
  { getOnInit: true },
);

export const checkAndCleanExpiredDataAtom = atom(null, (get, set) => {
  const lastEntrance = get(lastEntranceAtom);
  if (lastEntrance !== null && lastEntrance > new Date(DATA_EXPIRY).getTime()) {
    set(lastEntranceAtom, Date.now());
    return;
  }
  console.log("Clearing expired user data");

  // Clear all user-related data
  set(clearTokensAtom);
  set(isFirstProfileViewAtom, true);

  // Clear all user-related atoms
  set(userGenderAtom, null);
  set(userProfileAtom, null);
  set(savedProfilesAtom, []);
  set(purchasedProfilesAtom, []);
  set(recentlyViewedProfilesAtom, []);
  set(viewerAtom, null);

  // Update last entrance time
  set(lastEntranceAtom, Date.now());
});

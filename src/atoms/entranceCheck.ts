import { clearTokensAtom } from "@/atoms/authTokens";
import { userGenderAtom } from "@/atoms/userGender";
import { userProfileAtom } from "@/atoms/userProfile";
import {
  purchasedProfilesAtom,
  recentlyViewedProfilesAtom,
  savedProfilesAtom,
} from "@/atoms/viewerProfiles";
import { viewerSelfAtom } from "@/atoms/viewerSelf";
import { DATA_EXPIRY } from "@/env";
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const isFirstEntranceAtom = atomWithStorage<boolean>(
  "user.lastEntrance",
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

export const checkAndCleanExpiredDataAtom = atom(null, (get, set) => {
  const lastEntrance = get(lastEntranceAtom);
  if (lastEntrance !== null && lastEntrance > new Date(DATA_EXPIRY).getTime()) {
    set(lastEntranceAtom, Date.now());
    return;
  }

  // Clear all user-related data
  set(clearTokensAtom);
  set(isFirstEntranceAtom, true);

  // Clear all user-related atoms
  set(userGenderAtom, null);
  set(userProfileAtom, null);
  set(savedProfilesAtom, []);
  set(purchasedProfilesAtom, []);
  set(recentlyViewedProfilesAtom, []);
  set(viewerSelfAtom, null);

  // Update last entrance time
  set(lastEntranceAtom, Date.now());
});

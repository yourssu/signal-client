import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import type { ProfileContactResponse, ProfileResponse } from "@/types/profile"; // Assuming the type is here

// Base atom to store the array of profiles
export const savedProfilesAtom = atomWithStorage<ProfileResponse[]>(
  "profile.saved",
  [],
  undefined,
  { getOnInit: true },
);

// Write-only atom to handle the 'SAVE' action (appending a profile)
export const saveProfileAtom = atom(
  null, // Read function is null because this is write-only for this specific action
  (get, set, newProfile: ProfileResponse) => {
    const currentProfiles = get(savedProfilesAtom);
    set(savedProfilesAtom, [
      ...currentProfiles.filter(
        (profile) => profile.profileId != newProfile.profileId,
      ),
      newProfile,
    ]);
  },
);

// Base atom to store the array of profiles
export const purchasedProfilesAtom = atomWithStorage<ProfileContactResponse[]>(
  "profile.contacted",
  [],
  undefined,
  { getOnInit: true },
);

// Write-only atom to handle the 'SAVE' action (appending a profile)
export const purchaseProfileAtom = atom(
  null, // Read function is null because this is write-only for this specific action
  (get, set, newProfile: ProfileContactResponse) => {
    const currentProfiles = get(purchasedProfilesAtom);
    set(purchasedProfilesAtom, [
      ...currentProfiles.filter(
        (profile) => profile.profileId != newProfile.profileId,
      ),
      newProfile,
    ]);
  },
);

// Atom to store the recently viewed profile IDs (max 10)
export const recentlyViewedProfilesAtom = atomWithStorage<string[]>(
  "profile.viewed",
  [],
  undefined,
  { getOnInit: true },
); // Assuming profileId is a string

/**
 * Calculate the maximum number of recently viewed profiles to keep based on total profile count
 * Formula: ceil(1.5 * sqrt(count)), with special case for count=1 returning 0
 */
export const calculateMaxRecentlyViewedProfiles = (count: number): number => {
  if (count === 1) return 0;
  return Math.ceil(0.5 * Math.sqrt(count));
};

// Write-only atom to add a recently viewed profile ID
export const addRecentlyViewedProfileAtom = atom(
  null,
  (get, set, profileId: string, count: number) => {
    const currentIds = get(recentlyViewedProfilesAtom);
    // Remove the ID if it already exists to move it to the end
    const filteredIds = currentIds.filter((id) => id !== profileId);
    // Add the new ID to the end
    const updatedIds = [...filteredIds, profileId];

    // Calculate max profiles to keep based on total count
    const maxProfiles = calculateMaxRecentlyViewedProfiles(count);

    // Keep only the last n IDs based on calculated maxProfiles
    if (updatedIds.length > maxProfiles) {
      updatedIds.shift(); // Remove the oldest ID (first element)
    }

    set(recentlyViewedProfilesAtom, updatedIds);
  },
);

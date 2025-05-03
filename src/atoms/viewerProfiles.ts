import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import type { ProfileResponse } from "@/types/profile"; // Assuming the type is here

// Base atom to store the array of profiles
export const savedProfilesAtom = atomWithStorage<ProfileResponse[]>(
  "profile.saved",
  [],
  undefined,
  { getOnInit: true }
);

// Write-only atom to handle the 'SAVE' action (appending a profile)
export const saveProfileAtom = atom(
  null, // Read function is null because this is write-only for this specific action
  (get, set, newProfile: ProfileResponse) => {
    const currentProfiles = get(savedProfilesAtom);
    set(savedProfilesAtom, [...currentProfiles, newProfile]);
  }
);

// Atom to store the recently viewed profile IDs (max 10)
export const recentlyViewedProfilesAtom = atomWithStorage<string[]>(
  "profile.viewed",
  [],
  undefined,
  { getOnInit: true }
); // Assuming profileId is a string

// Write-only atom to add a recently viewed profile ID
export const addRecentlyViewedProfileAtom = atom(
  null,
  (get, set, profileId: string) => {
    const currentIds = get(recentlyViewedProfilesAtom);
    // Remove the ID if it already exists to move it to the end
    const filteredIds = currentIds.filter((id) => id !== profileId);
    // Add the new ID to the end
    const updatedIds = [...filteredIds, profileId];
    // Keep only the last 10 IDs
    if (updatedIds.length > 10) {
      updatedIds.shift(); // Remove the oldest ID (first element)
    }
    set(recentlyViewedProfilesAtom, updatedIds);
  }
);

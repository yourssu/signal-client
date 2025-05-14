import React, { useEffect } from "react";
import { Navigate, useNavigate } from "react-router";
import { useSetAtom, useAtomValue } from "jotai";
import { useCountProfile, useRandomProfile } from "@/hooks/queries/profiles";
import { Button } from "@/components/ui/button";
import { useUserUuid } from "@/hooks/useUserUuid";
import TopBar from "@/components/TopBar";
import { SaveDrawer } from "@/components/profile/SaveDrawer";
import {
  saveProfileAtom,
  savedProfilesAtom,
  recentlyViewedProfilesAtom,
  addRecentlyViewedProfileAtom,
} from "@/atoms/viewerProfiles";
import { SwipeableProfileCard } from "@/components/profile/SwipeableProfileCard";
import { useViewerSelf } from "@/hooks/queries/viewers";
import { userGenderAtom } from "@/atoms/userGender";
import { ENABLE_SAVED } from "@/env";

const ProfileListPage: React.FC = () => {
  const navigate = useNavigate();
  const uuid = useUserUuid();
  const gender = useAtomValue(userGenderAtom);
  const desiredGender = gender === "MALE" ? "FEMALE" : "MALE";
  const { data: viewerSelf, isLoading } = useViewerSelf(uuid);
  const ticketCount = (viewerSelf?.ticket ?? 0) - (viewerSelf?.usedTicket ?? 0);

  // Get recently viewed profiles to exclude them from random profile fetch
  const recentlyViewedProfiles = useAtomValue(recentlyViewedProfilesAtom);
  const addRecentlyViewedProfile = useSetAtom(addRecentlyViewedProfileAtom);

  // Convert string IDs to numbers for the API
  const excludeProfiles = recentlyViewedProfiles.map((id) => parseInt(id, 10));

  const { data: countData } = useCountProfile();

  const {
    data: profile,
    refetch,
    isRefetching,
  } = useRandomProfile(uuid, desiredGender!, excludeProfiles, {
    enabled: false,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (ticketCount > 0 && !profile) refetch();
  }, [profile, refetch, ticketCount]);

  // Add current profile to recently viewed profiles when it changes
  useEffect(() => {
    if (profile && countData) {
      addRecentlyViewedProfile(profile.profileId.toString(), countData.count);
    }
  }, [profile, countData, addRecentlyViewedProfile]);

  const saveProfile = useSetAtom(saveProfileAtom); // Corrected usage
  const savedProfiles = useAtomValue(savedProfilesAtom); // Read the saved profiles

  // Check if the current profile is already saved
  const isSaved =
    !!profile && savedProfiles.some((p) => p.profileId === profile.profileId);

  if (!isLoading && ticketCount <= 0) {
    return <Navigate to="/verify" />;
  }

  const count = `${countData?.count ?? 0}`.padStart(2, "0");

  const handleSave = () => {
    if (!profile) return; // Make sure profile data exists
    saveProfile(profile);
  };

  const handleViewContact = () => {
    if (!profile?.profileId) return;
    navigate(`/profile/contact?id=${profile.profileId}`, {
      state: {
        profile,
      },
    });
  };

  const handleSkip = () => {
    refetch();
  };

  return (
    <div className="w-full h-full flex flex-col items-center">
      <TopBar onBack="/" />
      <div className="flex flex-col gap-4 items-center w-full max-w-md grow p-6 overflow-hidden">
        <div className="flex flex-col items-start w-full">
          <h1 className="text-2xl font-semibold text-stone-700">
            <span className="text-primary">{count}명</span>이
            <br />
            당신의 시그널을 기다리는 중
          </h1>
        </div>
        <div className="w-full h-full max-w-md flex items-center justify-center grow">
          {profile && (
            <SwipeableProfileCard
              profile={profile}
              onSwipe={handleSkip}
              isRefetching={isRefetching}
            />
          )}
        </div>
        <div className="flex gap-4 w-full relative z-50">
          {ENABLE_SAVED && (
            <SaveDrawer>
              <Button
                onClick={handleSave}
                variant="secondary"
                size="xl"
                className="basis-1/3 rounded-3xl text-primary"
                disabled={isSaved} // Disable button if already saved
              >
                {isSaved ? "저장됨" : "저장"}
              </Button>
            </SaveDrawer>
          )}

          <Button
            onClick={handleViewContact}
            size="xl"
            className="grow rounded-3xl"
          >
            연락처 확인하기
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileListPage;

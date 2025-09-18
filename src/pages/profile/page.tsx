import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import { useSetAtom, useAtomValue, useAtom } from "jotai";
import { useCountProfile, useRandomProfile } from "@/hooks/queries/profiles";
import { Button } from "@/components/ui/button";
import TopBar from "@/components/Header";
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
import GenderStep from "@/components/purchase/GenderSelect";
import { Gender } from "@/types/profile";
import { viewProfile } from "@/lib/analytics";
import { toast } from "sonner";

const ProfileListPage: React.FC = () => {
  const navigate = useNavigate();
  const [gender, setGender] = useAtom(userGenderAtom);
  const desiredGender = gender === "MALE" ? "FEMALE" : "MALE";
  const { data: viewerSelf } = useViewerSelf({
    throwOnError: false,
    retry: false,
  });
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
    error,
  } = useRandomProfile(desiredGender!, excludeProfiles, {
    enabled: false,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (gender && !profile) {
      refetch();
      if (error) {
        toast.error(`프로필을 불러오지 못했어요.`, {
          description: error.message,
        });
      }
    }
  }, [error, gender, profile, refetch, ticketCount]);

  // Add current profile to recently viewed profiles when it changes
  useEffect(() => {
    if (gender && profile && countData) {
      addRecentlyViewedProfile(profile.profileId.toString(), countData.count);
      viewProfile(profile.profileId);
    }
  }, [profile, countData, addRecentlyViewedProfile, gender]);

  const saveProfile = useSetAtom(saveProfileAtom); // Corrected usage
  const savedProfiles = useAtomValue(savedProfilesAtom); // Read the saved profiles

  // Check if the current profile is already saved
  const isSaved =
    !!profile && savedProfiles.some((p) => p.profileId === profile.profileId);

  const handleGenderSelect = (selectedGender: Gender) => {
    setGender(selectedGender);
  };

  if (gender === null) {
    return (
      // Main page container - Flex column, min height screen
      <div className="flex flex-col min-h-dvh">
        <TopBar onBack="/" />
        {/* Content area - Takes remaining height, centers content */}
        <div className="flex-grow flex flex-col items-center justify-center p-4">
          {/* Funnel container - Max width */}
          <div className="w-full max-w-md h-full flex flex-col grow items-stretch justify-stretch">
            <GenderStep onSelect={handleGenderSelect} />
          </div>
        </div>
      </div>
    );
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
      <title>시그널 보내기 - 시그널</title>
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
                className="basis-1/3 text-primary"
                disabled={isSaved} // Disable button if already saved
              >
                {isSaved ? "저장됨" : "저장"}
              </Button>
            </SaveDrawer>
          )}

          <Button
            onClick={handleViewContact}
            size="xl"
            className="grow"
            disabled={!profile}
          >
            연락처 확인하기
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileListPage;

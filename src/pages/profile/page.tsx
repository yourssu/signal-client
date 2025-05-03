import React from "react";
import { useNavigate } from "react-router";
import { useSetAtom, useAtomValue } from "jotai"; // Import useSetAtom and useAtomValue
import ProfileCard from "../../components/profile/ProfileCard";
import { useCountProfile, useRandomProfile } from "@/hooks/queries/profiles";
import { Button } from "@/components/ui/button";
import { useUserUuid } from "@/hooks/useUserUuid";
import { ChevronRight } from "lucide-react";
import TopBar from "@/components/home/TopBar";
import { useViewerSelf } from "@/hooks/queries/viewers";
import { SaveDrawer } from "@/components/profile/SaveDrawer";
import { saveProfileAtom, savedProfilesAtom } from "@/atoms/viewerProfiles"; // Import savedProfilesAtom too

const ProfileListPage: React.FC = () => {
  const navigate = useNavigate();
  const uuid = useUserUuid();
  const { data: profile, refetch } = useRandomProfile(uuid);
  const { data: self } = useViewerSelf(uuid);
  const { data: countData } = useCountProfile();
  const saveProfile = useSetAtom(saveProfileAtom); // Corrected usage
  const savedProfiles = useAtomValue(savedProfilesAtom); // Read the saved profiles

  // Check if the current profile is already saved
  const isSaved =
    !!profile && savedProfiles.some((p) => p.profileId === profile.profileId);

  const count = `${countData?.count ?? 0}`.padStart(2, "0");

  const handleSave = () => {
    if (!profile) return; // Make sure profile data exists
    saveProfile(profile);
  };

  const handleViewContact = () => {
    if (!profile?.profileId) return;
    navigate(`/profile/contact/${profile.profileId}`, {
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
      <TopBar
        onBack="/"
        heartCount={self?.usedTicket ?? 0}
        ticketCount={(self?.ticket ?? 0) - (self?.usedTicket ?? 0)}
      />
      <div className="flex flex-col gap-4 items-center w-full max-w-md grow p-6">
        <div className="flex flex-col items-start w-full">
          <h1 className="text-2xl font-semibold text-stone-700">
            <span className="text-primary">{count}명</span>이
            <br />
            당신의 시그널을 기다리는 중
          </h1>
        </div>
        <div className="w-full max-w-md transition-transform flex items-center gap-2 grow">
          {profile && <ProfileCard profile={profile} className="grow" />}
          <Button variant="secondary" size="icon" onClick={handleSkip}>
            <ChevronRight />
          </Button>
        </div>
        <div className="flex gap-4 w-full">
          <SaveDrawer>
            <Button
              onClick={handleSave}
              variant="secondary"
              size="xl"
              className="basis-1/3 rounded-3xl text-primary"
              disabled={isSaved} // Disable button if already saved
            >
              {isSaved ? "저장됨" : "저장"}{" "}
              {/* Change text based on saved state */}
            </Button>
          </SaveDrawer>

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

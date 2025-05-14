import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAtomValue } from "jotai";
import { Button, buttonVariants } from "@/components/ui/button";
import TopBar from "@/components/TopBar";
import { savedProfilesAtom } from "@/atoms/viewerProfiles";
import { ProfileResponse } from "@/types/profile";
import { cn } from "@/lib/utils";
import { ScrollableCards } from "@/components/saved/ScrollableCards";

const SavedProfilesPage: React.FC = () => {
  const navigate = useNavigate();
  const savedProfiles = useAtomValue(savedProfilesAtom);

  const [profile, setProfile] = useState<ProfileResponse | null>(
    savedProfiles[0] || null,
  );

  // Update profile state when index changes

  const count = `${savedProfiles.length}`.padStart(2, "0");

  const handleBack = () => {
    navigate(-1); // Go back one step in browser history
  };

  const handleViewContact = () => {
    if (!profile?.profileId) return;
    navigate(`/profile/contact?id=${profile.profileId}&from=saved`, {
      state: {
        profile,
      },
    });
  };

  return (
    <div className="w-full h-full flex flex-col items-center">
      <TopBar onBack={handleBack} />
      {profile ? (
        <>
          <div className="flex flex-col gap-4 items-center w-full max-w-md grow p-6">
            <div className="flex flex-col items-start w-full">
              <h1 className="text-2xl font-semibold text-stone-700">
                내 마음 속에 <span className="text-primary">{count}명</span>이
                <br />
                저장되어 있어요
              </h1>
            </div>
            <ScrollableCards
              profiles={savedProfiles}
              selectedId={profile?.profileId}
              onSelect={setProfile}
            />
            <Button
              onClick={handleViewContact}
              size="xl"
              className="w-full rounded-3xl"
            >
              연락처 확인하기
            </Button>
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col gap-4 items-center w-full max-w-md grow p-6">
            <div className="flex flex-col items-start w-full">
              <h1 className="text-2xl font-semibold text-stone-700">
                아직 저장된 사람이 없어요
                <br />
                마음에 드는 사람을 저장해보세요
              </h1>
            </div>
            <Link
              to="/profile"
              className={cn(
                buttonVariants({ size: "xl" }),
                "w-full rounded-3xl mt-auto",
              )}
            >
              시그널 보내러 가기
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default SavedProfilesPage;

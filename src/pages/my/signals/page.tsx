import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAtomValue } from "jotai";
import { Button } from "@/components/ui/button";
import TopBar from "@/components/Header";
import {
  contactedProfilesAtom,
  savedProfilesAtom,
} from "@/atoms/viewerProfiles";
import { ProfileResponse } from "@/types/profile";
import { ScrollableCards } from "@/components/my/saved/ScrollableCards";
import { ENABLE_SAVED } from "@/env";
import main from "@/assets/home/main.png";

const ContactedProfilesPage: React.FC = () => {
  const navigate = useNavigate();
  const savedProfiles: Array<ProfileResponse & { contact?: string }> =
    useAtomValue(ENABLE_SAVED ? savedProfilesAtom : contactedProfilesAtom);

  const [profile, setProfile] = useState<
    (ProfileResponse & { contact?: string }) | null
  >(savedProfiles[0] || null);

  // Update profile state when index changes

  const count = `${savedProfiles.length}`.padStart(2, "0");

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
      <TopBar onBack="/my" />
      {profile ? (
        <>
          <div className="flex flex-col gap-4 items-center w-full max-w-md grow p-6">
            <div className="flex flex-col items-start w-full">
              {ENABLE_SAVED ? (
                <h1 className="text-2xl font-semibold text-stone-700">
                  내 마음 속에 <span className="text-primary">{count}명</span>이
                  <br />
                  저장되어 있어요
                </h1>
              ) : (
                <h1 className="text-2xl font-semibold text-stone-700">
                  <span className="text-primary">{count}명</span>에게
                  <br />
                  시그널을 보냈어요
                </h1>
              )}
            </div>
            <ScrollableCards
              profiles={savedProfiles}
              selectedId={profile?.profileId}
              onSelect={setProfile}
            />
            {ENABLE_SAVED && (
              <Button
                onClick={handleViewContact}
                size="xl"
                className="w-full rounded-3xl"
              >
                연락처 확인하기
              </Button>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col gap-4 items-center w-full max-w-md grow p-6">
            <div className="flex flex-col items-center justify-center w-full grow">
              <h1 className="text-2xl font-semibold text-stone-700">
                아직 보낸 시그널이 없어요
              </h1>
              <p>지금 바로 당신의 첫 시그널을 보내볼까요?</p>
              <div className="w-full max-w-[280px]">
                <img src={main} alt="Cat Character" className="w-full h-auto" />
              </div>
            </div>
            <div className="flex gap-4 w-full relative z-50">
              <Button
                variant="secondary"
                size="xl"
                className="basis-1/3 rounded-3xl text-primary"
                asChild
              >
                <Link to="/">홈으로</Link>
              </Button>
              <Button size="xl" className="grow rounded-3xl" asChild>
                <Link to="/profile">시그널 보내기</Link>
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ContactedProfilesPage;

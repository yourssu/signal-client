import React from "react";
import { useNavigate } from "react-router";
import ProfileCard from "../../components/profile/ProfileCard";
import { useRandomProfile } from "@/hooks/queries/profiles";
import { Button } from "@/components/ui/button";
import { useUserUuid } from "@/hooks/useUserUuid";
import { ChevronRight } from "lucide-react";
import TopBar from "@/components/home/TopBar";
import { useViewerSelf } from "@/hooks/queries/viewers";

const ProfileListPage: React.FC = () => {
  const navigate = useNavigate();
  const uuid = useUserUuid();
  const { data: profile, refetch } = useRandomProfile(uuid);
  const { data: self } = useViewerSelf(uuid);

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
            <span className="text-primary">000명</span>이
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
          <Button
            onClick={handleViewContact}
            variant="secondary"
            size="xl"
            className="basis-1/3 rounded-3xl text-primary"
          >
            저장
          </Button>
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

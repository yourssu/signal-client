import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { useSetAtom } from "jotai";
import { useCountProfile, useDeckProfiles } from "@/hooks/queries/profiles";
import { Button } from "@/components/ui/button";
import TopBar from "@/components/Header";
import { SwipeableProfileCard } from "@/components/profile/SwipeableProfileCard";
import { userGenderAtom } from "@/atoms/user";
import GenderStep from "@/components/purchase/GenderSelect";
import { Gender } from "@/types/profile";
import { viewProfile } from "@/lib/analytics";
import { useUser } from "@/hooks/useUser";
import { TicketRequiredModal } from "@/components/TicketRequiredModal";

const ProfileListPage: React.FC = () => {
  const navigate = useNavigate();
  const { gender, viewer } = useUser();
  const setGender = useSetAtom(userGenderAtom);
  const desiredGender = gender === "MALE" ? "FEMALE" : "MALE";

  const [currentIndex, setCurrentIndex] = useState(0);
  const [ticketModalOpen, setTicketModalOpen] = useState(false);

  const { data: countData } = useCountProfile();
  const { data: deck, isPending, error } = useDeckProfiles(desiredGender!, {
    enabled: !!desiredGender,
  });

  const profile = useMemo(
    () => (deck && deck.length > 0 ? deck[currentIndex] : null),
    [deck, currentIndex],
  );

  const canSwipeLeft = !!deck && currentIndex < deck.length - 1;
  const canSwipeRight = currentIndex > 0;

  const handleSwipe = (direction: "left" | "right") => {
    if (direction === "left" && canSwipeLeft) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      if (deck) {
        viewProfile(deck[nextIndex].profileId);
      }
    } else if (direction === "right" && canSwipeRight) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      if (deck) {
        viewProfile(deck[prevIndex].profileId);
      }
    }
  };

  const handleGenderSelect = (selectedGender: Gender) => {
    setGender(selectedGender);
  };

  if (gender === null) {
    return (
      <div className="flex flex-col min-h-dvh">
        <title>성별 선택하기 - 시그널</title>
        <TopBar onBack="/" />
        <div className="flex-grow flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-md h-full flex flex-col grow items-stretch justify-stretch">
            <GenderStep onSelect={handleGenderSelect} />
          </div>
        </div>
      </div>
    );
  }

  const count = `${countData?.count ?? 0}`.padStart(2, "0");

  const handleViewContact = () => {
    if (!profile?.profileId) return;
    if (!viewer || viewer.ticket - viewer.usedTicket <= 0) {
      setTicketModalOpen(true);
      return;
    }
    navigate(`/profile/contact?id=${profile.profileId}`, {
      state: {
        profile,
      },
    });
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
          {isPending && (
            <p className="text-label-neutral text-lg">프로필을 불러오는 중...</p>
          )}
          {error && (
            <p className="text-label-neutral text-lg">프로필을 불러오지 못했어요.</p>
          )}
          {profile && (
            <SwipeableProfileCard
              profile={profile}
              canSwipeLeft={canSwipeLeft}
              canSwipeRight={canSwipeRight}
              onSwipe={handleSwipe}
            />
          )}
          {!isPending && !error && deck?.length === 0 && (
            <p className="text-label-neutral text-lg">더 이상 프로필이 없어요.</p>
          )}
        </div>
        <div className="flex gap-4 w-full relative z-50">
          <Button
            onClick={handleViewContact}
            size="xl"
            className="w-full"
            disabled={!profile}
          >
            연락 보내기
          </Button>
        </div>
        <TicketRequiredModal
          open={ticketModalOpen}
          onOpenChange={setTicketModalOpen}
        />
      </div>
    </div>
  );
};

export default ProfileListPage;

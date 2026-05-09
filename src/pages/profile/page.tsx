import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { useAtom, useSetAtom } from "jotai";
import { useCountProfile, useDeckProfiles, usePurchasedCount } from "@/hooks/queries/profiles";
import { Button } from "@/components/ui/button";
import TopBar from "@/components/Header";
import { SwipeableProfileCard } from "@/components/profile/SwipeableProfileCard";
import { userGenderAtom } from "@/atoms/user";
import { profileDeckIndexAtom, profileDeckProfileIdAtom } from "@/atoms/profiles";
import GenderStep from "@/components/purchase/GenderSelect";
import { Gender } from "@/types/profile";
import { contactClick } from "@/lib/analytics";
import { useUser } from "@/hooks/useUser";
import { TicketRequiredModal } from "@/components/TicketRequiredModal";
import ConnectionInfo from "@/components/ConnectionInfo";
import { ENABLE_CONNECTION_INFO } from "@/env";

const ProfileListPage: React.FC = () => {
  const navigate = useNavigate();
  const { gender, viewer } = useUser();
  const setGender = useSetAtom(userGenderAtom);
  const desiredGender = gender === "MALE" ? "FEMALE" : "MALE";

  const [currentIndex, setCurrentIndex] = useAtom(profileDeckIndexAtom);
  const [savedProfileId, setSavedProfileId] = useAtom(profileDeckProfileIdAtom);
  const [ticketModalOpen, setTicketModalOpen] = useState(false);
  const [connectionInfoVisible, setConnectionInfoVisible] = useState(false);

  const { data: countData } = useCountProfile();
  const { data: purchasedCountData } = usePurchasedCount({
    enabled: ENABLE_CONNECTION_INFO,
  });

  const shouldShowConnectionInfo =
    ENABLE_CONNECTION_INFO && (purchasedCountData?.count ?? 0) > 0;

  useEffect(() => {
    if (!shouldShowConnectionInfo) return;
    setConnectionInfoVisible(true);
    const timer = setTimeout(() => setConnectionInfoVisible(false), 5000);
    return () => clearTimeout(timer);
  }, [shouldShowConnectionInfo]);

  const { data: deck, isPending, error } = useDeckProfiles(desiredGender!, {
    enabled: !!desiredGender,
  });

  const prevGenderRef = useRef(desiredGender);
  useEffect(() => {
    if (prevGenderRef.current !== desiredGender) {
      setCurrentIndex(0);
      setSavedProfileId(null);
      prevGenderRef.current = desiredGender;
    }
  }, [desiredGender, setCurrentIndex, setSavedProfileId]);

  useEffect(() => {
    if (!deck || deck.length === 0) return;
    if (savedProfileId !== null) {
      const foundIndex = deck.findIndex(
        (p) => p.profileId === savedProfileId,
      );
      if (foundIndex >= 0) {
        setCurrentIndex(foundIndex);
      }
      setSavedProfileId(null);
    }
  }, [deck, savedProfileId, setCurrentIndex, setSavedProfileId]);

  const safeIndex = deck
    ? Math.min(currentIndex, Math.max(deck.length - 1, 0))
    : 0;

  const profile = useMemo(
    () => (deck && deck.length > 0 ? deck[safeIndex] : null),
    [deck, safeIndex],
  );

  const canSwipeLeft = !!deck && safeIndex < deck.length - 1;
  const canSwipeRight = safeIndex > 0;

  const handleSwipe = (direction: "left" | "right") => {
    if (direction === "left" && canSwipeLeft) {
      setCurrentIndex(safeIndex + 1);
    } else if (direction === "right" && canSwipeRight) {
      setCurrentIndex(safeIndex - 1);
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
          <GenderStep onSelect={handleGenderSelect} />
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
    contactClick(profile.profileId);
    setSavedProfileId(profile.profileId);
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
      <div className="flex flex-col gap-4 items-center w-full max-w-md grow p-6 overflow-hidden relative">
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
        <div className="flex flex-col gap-3 w-full relative z-50">
          <ConnectionInfo
            count={purchasedCountData?.count ?? 0}
            visible={connectionInfoVisible}
            className="absolute -top-14 left-1/2 -translate-x-1/2"
          />
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

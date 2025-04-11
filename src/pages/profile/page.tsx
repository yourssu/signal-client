import React, { useState, useRef } from "react";
import { useNavigate } from "react-router";
import ProfileCard from "../../components/profile/ProfileCard";
import { useProfile } from "@/queries/profile";
import { useAtom } from "jotai";
import { userUuid } from "@/atoms/userUuid";

const ProfileListPage: React.FC = () => {
  const navigate = useNavigate();
  const [uuid] = useAtom(userUuid);
  const { data: profile, refetch } = useProfile(uuid);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);

    if (cardRef.current && touchStart !== null) {
      const distance = touchStart - e.targetTouches[0].clientX;
      const translateX = -distance;
      cardRef.current.style.transform = `translateX(${translateX}px)`;
    }
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (cardRef.current) {
      cardRef.current.style.transform = "";
    }

    if (isLeftSwipe) {
      handleViewContact();
    } else if (isRightSwipe) {
      handleSkip();
    }
  };

  const handleViewContact = () => {
    if (!profile?.profileId) return;
    navigate(`/profile/contact/${profile.profileId}`);
  };

  const handleSkip = () => {
    refetch();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div
        ref={cardRef}
        className="w-full max-w-sm transition-transform"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {profile && (
          <ProfileCard
            profile={profile}
            onViewContact={handleViewContact}
            onSkip={handleSkip}
          />
        )}
      </div>
    </div>
  );
};

export default ProfileListPage;

import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useSetAtom, useAtomValue } from "jotai";
import ProfileCard from "@/components/profile/ProfileCard";
import { useCountProfile, useRandomProfile } from "@/hooks/queries/profiles";
import { Button } from "@/components/ui/button";
import { useUserUuid } from "@/hooks/useUserUuid";
import TopBar from "@/components/home/TopBar";
import { SaveDrawer } from "@/components/profile/SaveDrawer";
import { saveProfileAtom, savedProfilesAtom } from "@/atoms/viewerProfiles";
import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { ProfileResponse } from "@/types/profile";

const ProfileListPage: React.FC = () => {
  const navigate = useNavigate();
  const uuid = useUserUuid();
  const { data: profile, refetch } = useRandomProfile(uuid);
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
      <TopBar onBack="/" />
      <div className="flex flex-col gap-4 items-center w-full max-w-md grow p-6">
        <div className="flex flex-col items-start w-full">
          <h1 className="text-2xl font-semibold text-stone-700">
            <span className="text-primary">{count}명</span>이
            <br />
            당신의 시그널을 기다리는 중
          </h1>
        </div>
        <div className="w-full max-w-md flex items-center justify-center grow relative">
          {profile && (
            <SwipeableProfileCard profile={profile} onSwipe={handleSkip} />
          )}
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
              {isSaved ? "저장됨" : "저장"}
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

// SwipeableProfileCard component for handling swipe gestures
const SwipeableProfileCard: React.FC<{
  profile: ProfileResponse;
  onSwipe: () => void;
}> = ({ profile, onSwipe }) => {
  const [swiped, setSwiped] = useState(false);

  // Motion values for tracking card position and rotation
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-200, 0, 200], [-15, 0, 15]);

  // Calculate opacity based on swipe distance
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  // Function to handle drag movement
  const handleDrag = (mx: number, down: boolean, xDir: number) => {
    // If already swiped, ignore further gestures
    if (swiped) return;

    const swipeThreshold = 100;
    const isSwipedRight = mx > swipeThreshold;
    const isSwipedLeft = mx < -swipeThreshold;
    const isSwipeComplete = isSwipedRight || isSwipedLeft;

    // If still dragging, update position
    if (down) {
      x.set(mx);
      return;
    }

    // If swipe is complete, animate card off screen
    if (isSwipeComplete) {
      const direction = xDir > 0 ? 1 : -1;
      const targetX = direction * window.innerWidth;

      // Mark as swiped to prevent further gestures
      setSwiped(true);

      // Animate card off screen
      animate(x, targetX, {
        duration: 0.3,
        onComplete: () => {
          // Reset position and call onSwipe callback
          x.set(0);
          setSwiped(false);
          onSwipe();
        },
      });
    } else {
      // If swipe is not complete, animate back to center
      animate(x, 0, { duration: 0.3 });
    }
  };

  // Handle touch events for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    // Store initial touch position
    const touchStartX = e.touches[0].clientX;

    const handleTouchMove = (e: TouchEvent) => {
      const currentX = e.touches[0].clientX;
      const deltaX = currentX - touchStartX;
      x.set(deltaX);
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const currentX = e.changedTouches[0].clientX;
      const deltaX = currentX - touchStartX;
      const direction = deltaX > 0 ? 1 : -1;

      handleDrag(deltaX, false, direction);

      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };

    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleTouchEnd);
  };

  // Handle mouse events for desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    const mouseStartX = e.clientX;

    const handleMouseMove = (e: MouseEvent) => {
      const currentX = e.clientX;
      const deltaX = currentX - mouseStartX;
      x.set(deltaX);
    };

    const handleMouseUp = (e: MouseEvent) => {
      const currentX = e.clientX;
      const deltaX = currentX - mouseStartX;
      const direction = deltaX > 0 ? 1 : -1;

      handleDrag(deltaX, false, direction);

      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div className="absolute w-full touch-none cursor-grab active:cursor-grabbing">
      <motion.div
        style={{ x, y, rotate, opacity }}
        onTouchStart={handleTouchStart}
        onMouseDown={handleMouseDown}
      >
        <ProfileCard profile={profile} className="grow" />
      </motion.div>
    </div>
  );
};

export default ProfileListPage;

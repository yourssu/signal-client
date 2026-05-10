import { isFirstProfileViewAtom } from "@/atoms/user";
import CompatibilityBadge from "@/components/profile/CompatibilityBadge";
import ProfileCard from "@/components/profile/ProfileCard";
import { useUser } from "@/hooks/useUser";
import { swipeStart, swipeStop } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { ProfileResponse } from "@/types/profile";
import { useSetAtom } from "jotai";
import { MoveHorizontal } from "lucide-react";
import {
  useMotionValue,
  useTransform,
  animate,
  motion,
  AnimationPlaybackControls,
} from "motion/react";
import { useState, useEffect } from "react";

export const SwipeableProfileCard: React.FC<{
  profile: ProfileResponse;
  canSwipeRight: boolean;
  canSwipeLeft: boolean;
  onSwipe: (direction: "left" | "right") => void;
}> = ({ profile, canSwipeRight, canSwipeLeft, onSwipe }) => {
  const setIsFirstProfileView = useSetAtom(isFirstProfileViewAtom);
  const { isFirstProfileView } = useUser();
  const [swiped, setSwiped] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-200, 0, 200], [-15, 0, 15]);
  const opacityX = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);
  const opacityY = useTransform(y, [0, 100], [1, 0]);
  const opacity = useTransform(() => opacityX.get() * opacityY.get());

  useEffect(() => {
    let animation: AnimationPlaybackControls | undefined;

    if (isFirstProfileView) {
      animation = animate(x, 20, {
        type: "spring",
        stiffness: 400,
        damping: 70,
        repeat: Infinity,
        repeatType: "reverse",
      });
    } else {
      animate(x, 0, {
        type: "spring",
        stiffness: 400,
        damping: 70,
      });
    }

    return () => {
      if (animation) {
        animation.stop();
      }
    };
  }, [isFirstProfileView, x]);

  useEffect(() => {
    animate(y, 0, {
      type: "spring",
      stiffness: 300,
      damping: 25,
      duration: 0.5,
    });
  }, [profile.profileId, y]);

  const handleDrag = (mx: number, down: boolean, xDir: number) => {
    if (isFirstProfileView) {
      setIsFirstProfileView(false);
      return;
    }
    if (swiped) return;

    const swipeThreshold = 90;
    const isSwipedRight = mx > swipeThreshold;
    const isSwipedLeft = mx < -swipeThreshold;

    if (down) {
      x.set(mx);
      return;
    }

    if ((isSwipedLeft && canSwipeLeft) || (isSwipedRight && canSwipeRight)) {
      const direction = xDir > 0 ? 1 : -1;
      const targetX = direction * window.innerWidth;

      setSwiped(true);

      animate(x, targetX, {
        duration: 0.3,
        onComplete: () => {
          y.set(100);
          x.set(0);
          opacity.set(0);
          const dir = direction > 0 ? "right" : "left";
          onSwipe(dir);
          setSwiped(false);
        },
      });
    } else if (isSwipedLeft || isSwipedRight) {
      animate(x, 0, { duration: 0.3 });
      swipeStop(xDir > 0 ? "right" : "left", profile.profileId);
    } else {
      animate(x, 0, { duration: 0.3 });
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touchStartX = e.touches[0].clientX;
    swipeStart(
      touchStartX > window.innerWidth / 2 ? "right" : "left",
      profile.profileId,
    );

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

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    const mouseStartX = e.clientX;
    swipeStart(
      mouseStartX > window.innerWidth / 2 ? "right" : "left",
      profile.profileId,
    );

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
    <motion.div
      style={{ x, y, rotate, opacity }}
      onTouchStart={handleTouchStart}
      onMouseDown={handleMouseDown}
      className="w-full h-auto touch-none cursor-grab active:cursor-grabbing relative"
    >
      <div className="w-full flex flex-col gap-2">
        {profile.compatibilityLabel && (
          <CompatibilityBadge label={profile.compatibilityLabel} />
        )}
        <ProfileCard
          profile={profile}
          className="grow h-auto"
          side="front"
          size="L"
          compact={!!profile.compatibilityLabel}
        />
      </div>
      <div
        className={cn(
          "opacity-0 absolute inset-0 bg-black/75 rounded-4xl flex flex-col items-center justify-center transition-opacity",
          isFirstProfileView && "opacity-100",
        )}
      >
        <MoveHorizontal className="text-pale-pink" />
        <p className="text-pale-pink">좌우로 움직여 프로필을 넘겨 보세요</p>
        <p className="text-sm text-primary mt-6 font-bold">
          왼쪽으로 스와이프:{" "}
          <span className="text-white font-medium">다음 프로필</span>
          <br />
          오른쪽으로 스와이프:{" "}
          <span className="text-white font-medium">이전 프로필</span>
        </p>
      </div>
    </motion.div>
  );
};

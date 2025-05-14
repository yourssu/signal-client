import { isFirstEntranceAtom } from "@/atoms/isFirstEntrance";
import ProfileCard from "@/components/profile/ProfileCard";
import { cn } from "@/lib/utils";
import { ProfileResponse } from "@/types/profile";
import { useAtom } from "jotai";
import { MoveHorizontal } from "lucide-react";
import {
  useMotionValue,
  useTransform,
  animate,
  motion,
  AnimationPlaybackControls,
} from "motion/react";
import { useState, useEffect } from "react";

// SwipeableProfileCard component for handling swipe gestures
export const SwipeableProfileCard: React.FC<{
  profile: ProfileResponse;
  isRefetching: boolean;
  onSwipe: () => void;
}> = ({ profile, isRefetching, onSwipe }) => {
  const [isFirstEntrance, setIsFirstEntrance] = useAtom(isFirstEntranceAtom);
  const [swiped, setSwiped] = useState(false);

  // Motion values for tracking card position and rotation
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-200, 0, 200], [-15, 0, 15]);
  // Calculate opacity based on swipe distance
  const opacityX = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);
  const opacityY = useTransform(y, [0, 100], [1, 0]);
  const opacity = useTransform(() => opacityX.get() * opacityY.get());

  // Setup guide animation when isFirstEntrance changes
  useEffect(() => {
    let animation: AnimationPlaybackControls | undefined;

    if (isFirstEntrance) {
      animation = animate(x, 20, {
        type: "spring",
        stiffness: 400,
        damping: 70,
        repeat: Infinity,
        repeatType: "reverse",
      });
    } else {
      // Reset position when animation stops
      animate(x, 0, {
        type: "spring",
        stiffness: 400,
        damping: 70,
      });
    }

    // Cleanup animation when component unmounts or isFirstEntrance changes
    return () => {
      if (animation) {
        animation.stop();
      }
    };
  }, [isFirstEntrance, x]);

  // Animation for profile change
  useEffect(() => {
    // Regular profile change animation
    if (!isRefetching) {
      animate(y, 0, {
        type: "spring",
        stiffness: 300,
        damping: 25,
        duration: 0.5,
      });
    }
  }, [isRefetching, y]);

  // Function to handle drag movement
  const handleDrag = (mx: number, down: boolean, xDir: number) => {
    if (isFirstEntrance) setIsFirstEntrance(false);
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
          y.set(100);
          x.set(0);
          opacity.set(0);
          onSwipe();
          setSwiped(false);
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
    <motion.div
      style={{ x, y, rotate, opacity }}
      onTouchStart={handleTouchStart}
      onMouseDown={handleMouseDown}
      className="w-full h-auto touch-none cursor-grab active:cursor-grabbing relative"
    >
      <ProfileCard profile={profile} className="grow h-auto" />
      <div
        className={cn(
          "opacity-0 absolute inset-0 bg-black/75 rounded-4xl flex flex-col items-center justify-center transition-opacity",
          isFirstEntrance && "opacity-100",
        )}
      >
        <MoveHorizontal className="text-pale-pink" />
        <p className="text-pale-pink">좌우로 움직여 프로필을 넘겨 보세요</p>
        <p className="text-sm text-primary">
          주의: 한 번 넘기면 되돌아갈 수 없습니다!
        </p>
      </div>
    </motion.div>
  );
};

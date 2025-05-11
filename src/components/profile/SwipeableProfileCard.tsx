import ProfileCard from "@/components/profile/ProfileCard";
import { ProfileResponse } from "@/types/profile";
import { useMotionValue, useTransform, animate, motion } from "motion/react";
import { useState } from "react";

// SwipeableProfileCard component for handling swipe gestures
export const SwipeableProfileCard: React.FC<{
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

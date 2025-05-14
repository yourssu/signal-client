import { animate, motion, useMotionValue } from "motion/react";
import { useEffect, useState } from "react";
import ProfileCard from "./ProfileCard";
import { ProfileResponse } from "@/types/profile";
import { cn } from "@/lib/utils";

interface TurnableProfileCardProps {
  profile: ProfileResponse;
  contact: string;
  className?: string;
  isFlipped?: boolean;
  size?: "full" | "small";
}

const TurnableProfileCard: React.FC<TurnableProfileCardProps> = ({
  profile,
  contact,
  className,
  isFlipped: defaultFlipped = false,
  size,
}) => {
  const [isFlipped, setIsFlipped] = useState(defaultFlipped);
  // Use Inverted value for the initial rotation
  const rotateY = useMotionValue(defaultFlipped ? 0 : 180);

  useEffect(() => {
    animate(rotateY, defaultFlipped ? 180 : 0, {
      type: "spring",
      duration: 0.6,
      damping: 20,
      stiffness: 100,
      delay: 1,
    });
  }, [defaultFlipped, rotateY]);

  useEffect(() => {
    animate(rotateY, isFlipped ? 180 : 0, {
      type: "spring",
      duration: 0.6,
      damping: 20,
      stiffness: 100,
    });
  }, [isFlipped, rotateY]);

  return (
    <div
      className="relative cursor-pointer"
      style={{ perspective: "2000px" }}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="relative w-full"
        style={{ transformStyle: "preserve-3d", rotateY }}
        initial={false}
        transition={{
          duration: 0.6,
          type: "spring",
          damping: 20,
          stiffness: 100,
        }}
      >
        <motion.div
          className="absolute w-full h-full"
          initial={false}
          animate={{ opacity: isFlipped ? 0 : 1 }}
          transition={{ duration: 0.3 }}
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          <ProfileCard profile={profile} className={className} size={size} />
        </motion.div>

        <motion.div
          className="absolute w-full h-full"
          initial={false}
          animate={{ opacity: isFlipped ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <ProfileCard
            profile={profile}
            contact={contact}
            className={cn("h-full", className)}
            size={size}
          />
        </motion.div>

        {/* Invisible element to maintain container size */}
        <div className="invisible">
          <ProfileCard profile={profile} className={className} size={size} />
        </div>
      </motion.div>
    </div>
  );
};

export default TurnableProfileCard;

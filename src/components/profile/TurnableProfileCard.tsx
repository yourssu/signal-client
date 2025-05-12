import { motion } from "motion/react";
import { useState } from "react";
import ProfileCard from "./ProfileCard";
import { ProfileResponse } from "@/types/profile";

interface TurnableProfileCardProps {
  profile: ProfileResponse;
  contact: string;
  className?: string;
}

const TurnableProfileCard: React.FC<TurnableProfileCardProps> = ({
  profile,
  contact,
  className,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="relative cursor-pointer"
      style={{ perspective: "2000px" }}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="relative w-full"
        style={{ transformStyle: "preserve-3d" }}
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{
          duration: 0.6,
          type: "spring",
          damping: 20,
          stiffness: 100,
        }}
      >
        <motion.div
          className="absolute w-full"
          initial={false}
          animate={{ opacity: isFlipped ? 0 : 1 }}
          transition={{ duration: 0.3 }}
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          <ProfileCard profile={profile} className={className} />
        </motion.div>

        <motion.div
          className="absolute w-full"
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
            className={className}
          />
        </motion.div>

        {/* Invisible element to maintain container size */}
        <div className="invisible">
          <ProfileCard profile={profile} className={className} />
        </div>
      </motion.div>
    </div>
  );
};

export default TurnableProfileCard;

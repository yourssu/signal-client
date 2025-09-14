import AnimalImage from "@/components/profile/AnimalImage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { animalDisplayMap } from "@/lib/animal";
import { cn } from "@/lib/utils";
import { ProfileContactResponse, ProfileUpdateRequest } from "@/types/profile";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { useMotionValue, animate, motion } from "motion/react";
import React, { useEffect, useState } from "react";

interface ProfileCardEditorProps {
  profile: ProfileContactResponse;
  className?: string;
  onChange?: (update: ProfileUpdateRequest) => void;
  isFlipped?: boolean;
}

const ProfileCardEditor: React.FC<ProfileCardEditorProps> = ({
  profile,
  className,
  onChange,
  isFlipped: defaultFlipped = false,
}) => {
  const [isFlipped, setIsFlipped] = useState(defaultFlipped);
  const [isFlipping, setIsFlipping] = useState(false);
  // Use Inverted value for the initial rotation
  const rotateY = useMotionValue(defaultFlipped ? 0 : 180);

  const handleNicknameChange = (nickname: string) => {
    onChange?.({
      nickname,
      introSentences: profile.introSentences,
      contact: profile.contact,
    });
  };

  const handleIntroSentenceChange = (index: number, introSentence: string) => {
    const newSentences = [...profile.introSentences];
    newSentences[index] = introSentence;
    onChange?.({
      nickname: profile.nickname,
      introSentences: newSentences,
      contact: profile.contact,
    });
  };

  const handleContactChange = (contact: string) => {
    onChange?.({
      nickname: profile.nickname,
      introSentences: profile.introSentences,
      contact,
    });
  };

  useEffect(() => {
    animate(rotateY, defaultFlipped ? 180 : 0, {
      type: "spring",
      duration: 0.6,
      damping: 20,
      stiffness: 100,
      delay: 1,
      onPlay: () => setIsFlipping(true),
      onComplete: () => setIsFlipping(false),
    });
  }, [defaultFlipped, rotateY]);

  useEffect(() => {
    animate(rotateY, isFlipped ? 180 : 0, {
      type: "spring",
      duration: 0.6,
      damping: 20,
      stiffness: 100,
      onPlay: () => setIsFlipping(true),
      onComplete: () => setIsFlipping(false),
    });
  }, [isFlipped, rotateY]);

  return (
    <div className="relative" style={{ perspective: "2000px" }}>
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
          <ProfileCardEditorFront
            profile={profile}
            className={className}
            isShown={!isFlipped}
            isFlipping={isFlipping}
            onNicknameChange={handleNicknameChange}
            onIntroSentenceChange={handleIntroSentenceChange}
            onFlip={() => setIsFlipped(true)}
          />
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
          <ProfileCardEditorBack
            profile={profile}
            className={cn("h-full", className)}
            onFlip={() => setIsFlipped(false)}
            onContactChange={handleContactChange}
          />
        </motion.div>

        {/* Invisible element to maintain container size */}
        <div className="invisible">
          <ProfileCardEditorFront
            isFlipping={isFlipping}
            isShown={false}
            profile={profile}
            className={className}
          />
        </div>
      </motion.div>
    </div>
  );
};

interface ProfileCardEditorFrontProps {
  profile: ProfileContactResponse;
  isFlipping: boolean;
  isShown: boolean;
  className?: string;
  onNicknameChange?: (nickname: string) => void;
  onIntroSentenceChange?: (index: number, sentence: string) => void;
  onFlip?: () => void;
}

const ProfileCardEditorFront: React.FC<ProfileCardEditorFrontProps> = ({
  profile,
  className,
  isShown,
  isFlipping,
  onNicknameChange,
  onIntroSentenceChange,
  onFlip,
}) => {
  const shortenedYear = profile.birthYear.toString().slice(-2);

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onNicknameChange?.(e.target.value);
  };

  const handleIntroSentenceChange = (index: number, value: string) => {
    onIntroSentenceChange?.(index, value);
  };
  return (
    <div
      className={cn(
        "relative profile-card-background rounded-4xl shadow-md overflow-hidden flex flex-col justify-center items-center gap-2 p-5 select-none",
        className,
      )}
    >
      <div className="flex flex-col items-center gap-2 mx-4">
        <Badge
          variant="outline"
          className={cn(
            "profile-badge rounded-full px-3 py-1 flex justify-center items-center gap-1",
            profile.gender === "MALE"
              ? "border-blue/50 text-blue"
              : "border-primary/50 text-primary",
          )}
        >
          {shortenedYear}년생
          <Heart
            className={cn(
              "size-2",
              profile.gender === "MALE" ? "fill-blue" : "fill-primary",
            )}
          />
          {profile.department}
        </Badge>
        <div className="flex flex-col items-center w-full">
          <AnimalImage
            animalType={profile.animal}
            className={cn("w-full object-contain max-h-[140px]")}
          />
        </div>
        <div className="flex flex-col items-stretch w-full">
          <div className="flex flex-col items-stretch gap-3 w-full">
            <div className="flex flex-col gap-1">
              <Input
                value={profile.nickname}
                onChange={handleNicknameChange}
                className="text-foreground font-semibold leading-5 text-center w-full text-xl"
                style={{ fontSize: "1.25rem" }}
                maxLength={15}
              />
              <p
                className={cn(
                  "text-muted-foreground text-center text-sm font-medium",
                )}
              >
                {animalDisplayMap[profile.animal]}·{profile.mbti}
              </p>
            </div>
            <div className="flex flex-col items-stretch gap-1 w-full">
              {profile.introSentences.map((sentence, index) => (
                <Input
                  key={index}
                  value={sentence}
                  onChange={(e) =>
                    handleIntroSentenceChange(index, e.target.value)
                  }
                  className="w-full text-start text-sm"
                  maxLength={20}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="absolute right-3 h-full flex flex-col justify-center">
        <Tooltip open={!isFlipping && isShown}>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              onClick={onFlip}
              className="border-primary text-primary rounded-full size-6 opacity-75 hover:text-primary"
            >
              <ChevronRight className="size-3" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>연락처 수정하기</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};

interface ProfileCardEditorBackProps {
  profile: ProfileContactResponse;
  className?: string;
  onContactChange: (contact: string) => void;
  onFlip: () => void;
}

const ProfileCardEditorBack: React.FC<ProfileCardEditorBackProps> = ({
  profile,
  className,
  onContactChange,
  onFlip,
}) => {
  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onContactChange(e.target.value);
  };

  return (
    <div
      className={cn(
        "relative profile-card-background rounded-4xl shadow-md overflow-hidden flex flex-col justify-center items-center gap-2 p-5 select-none",
        className,
      )}
    >
      <div className="flex flex-col items-center justify-center gap-2 mx-4">
        <h2 className="text-lg font-semibold text-stone-700">
          현재 등록된 연락처
        </h2>
        <Input
          value={profile.contact}
          onChange={handleContactChange}
          className="text-foreground font-semibold leading-5 text-center text-xl ㅡ"
          style={{ fontSize: "1.25rem" }}
          maxLength={15}
        />
      </div>
      <div className="absolute left-3 h-full flex flex-col justify-center">
        <Button
          size="sm"
          variant="outline"
          onClick={onFlip}
          className="border-primary text-primary rounded-full size-6 opacity-75 hover:text-primary"
        >
          <ChevronLeft className="size-3" />
        </Button>
      </div>
    </div>
  );
};

export default ProfileCardEditor;

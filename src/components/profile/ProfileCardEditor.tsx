import AnimalImage from "@/components/profile/AnimalImage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { animalDisplayMap } from "@/lib/animal";
import { cn } from "@/lib/utils";
import {
  Gender,
  ProfileContactResponse,
  ProfileUpdateRequest,
  StyleType,
} from "@/types/profile";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMotionValue, animate, motion } from "motion/react";
import React, { useEffect, useState } from "react";

interface ProfileCardEditorProps {
  profile: ProfileContactResponse;
  className?: string;
  onChange?: (update: ProfileUpdateRequest) => void;
  isFlipped?: boolean;
}

const genderConfig: Record<
  Gender,
  {
    cardBg: string;
    tagBg: string;
    tagText: string;
  }
> = {
  MALE: {
    cardBg: "bg-fill-blue-light",
    tagBg: "bg-fill-blue",
    tagText: "text-secondary-strong",
  },
  FEMALE: {
    cardBg: "bg-fill-pink-light",
    tagBg: "bg-fill-pink",
    tagText: "text-primary",
  },
};

const styleLabelMap: Record<StyleType, string> = {
  TETO: "테토",
  EGEN: "에겐",
};

const ProfileCardEditor: React.FC<ProfileCardEditorProps> = ({
  profile,
  className,
  onChange,
  isFlipped: defaultFlipped = false,
}) => {
  const [isFlipped, setIsFlipped] = useState(defaultFlipped);
  const [isFlipping, setIsFlipping] = useState(false);
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
  const gender = profile.gender;
  const config = genderConfig[gender];
  const displayYear = profile.birthYear.toString();

  return (
    <div
      className={cn(
        config.cardBg,
        "relative rounded-[36px] overflow-hidden flex flex-col p-3 items-center w-full select-none",
        className,
      )}
    >
      <div className="flex flex-col items-center gap-3 px-3 pt-5 pb-4">
        <div className="flex flex-col items-center gap-1 w-full px-1">
          <p className="text-label-neutral font-medium text-xs leading-tight whitespace-nowrap">
            {displayYear}년생 · {animalDisplayMap[profile.animal]}상
          </p>
          <Input
            value={profile.nickname}
            onChange={(e) => onNicknameChange?.(e.target.value)}
            className="text-label-strong font-semibold text-xl leading-tight text-center whitespace-nowrap"
            style={{ fontSize: "1.25rem" }}
            maxLength={15}
          />
        </div>

        <div className="flex items-center justify-center w-full h-[126px]">
          <AnimalImage
            animalType={profile.animal}
            gender={gender}
            className="object-contain max-h-[126px]"
          />
        </div>

        <div className="flex gap-1 items-center justify-center w-full">
          <span
            className={cn(
              config.tagBg,
              config.tagText,
              "rounded-lg font-medium whitespace-nowrap px-2.5 py-1.5 text-xs",
            )}
          >
            #{profile.mbti}
          </span>
          {profile.department && (
            <span
              className={cn(
                config.tagBg,
                config.tagText,
                "rounded-lg font-medium whitespace-nowrap px-2.5 py-1.5 text-xs",
              )}
            >
              #{profile.department}
            </span>
          )}
          {profile.style && (
            <span
              className={cn(
                profile.style === "TETO"
                  ? "bg-fill-blue text-secondary-strong"
                  : "bg-fill-pink text-primary",
                "rounded-lg font-medium whitespace-nowrap px-2.5 py-1.5 text-xs",
              )}
            >
              #{styleLabelMap[profile.style]}
            </span>
          )}
        </div>
      </div>

      <div className="bg-white rounded-3xl w-full px-3 py-2 flex flex-col justify-center">
        {profile.introSentences.map((sentence, index) => (
          <div
            key={index}
            className="flex flex-col gap-1.5 px-2 py-1.5 w-full"
          >
            <p className="text-label-neutral text-[10px] font-semibold leading-[1.35]">
              특징 {index + 1}
            </p>
            <Input
              value={sentence}
              onChange={(e) => onIntroSentenceChange?.(index, e.target.value)}
              className="w-full text-start text-base"
              maxLength={20}
            />
          </div>
        ))}
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
  const gender = profile.gender;
  const config = genderConfig[gender];
  const displayYear = profile.birthYear.toString();

  return (
    <div
      className={cn(
        config.cardBg,
        "relative rounded-[36px] overflow-hidden flex flex-col p-3 items-center w-full select-none",
        className,
      )}
    >
      <div className="flex flex-col items-center gap-3 px-3 pt-6 pb-4">
        <div className="flex flex-col items-center gap-1 w-full px-1">
          <p className="text-label-neutral font-medium text-xs leading-tight whitespace-nowrap">
            {displayYear}년생 · {animalDisplayMap[profile.animal]}상
          </p>
          <p className="text-label-strong font-semibold text-xl leading-tight whitespace-nowrap">
            {profile.nickname}
          </p>
        </div>

        <div className="flex items-center justify-center w-full h-[126px]">
          <AnimalImage
            animalType={profile.animal}
            gender={gender}
            className="object-contain max-h-[126px]"
          />
        </div>

        <Input
          value={profile.contact}
          onChange={(e) => onContactChange(e.target.value)}
          className={cn(
            "w-full text-center text-lg font-medium leading-5 rounded-2xl p-4 underline",
            gender === "MALE"
              ? "bg-fill-blue-light border border-secondary-strong/20 text-secondary-strong"
              : "bg-fill-pink-light border border-primary/20 text-primary",
          )}
          style={{ fontSize: "1.125rem" }}
          maxLength={15}
        />
        <p
          className={cn(
            "text-sm font-medium",
            gender === "MALE" ? "text-secondary-strong" : "text-primary",
          )}
        >
          {profile.contact.startsWith("@")
            ? "아이디를 누르면 인스타로 연결됩니다."
            : "번호를 누르면 연락처를 추가할 수 있습니다."}
        </p>
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

import AnimalImage from "@/components/profile/AnimalImage";
import { animalDisplayMap } from "@/lib/animal";
import { cn } from "@/lib/utils";
import { Gender, ProfileResponse, StyleType } from "@/types/profile";
import React from "react";

type CardSide = "front" | "back";
type CardSize = "L" | "S";

interface ProfileCardProps {
  profile: ProfileResponse;
  contact?: string;
  className?: string;
  side?: CardSide;
  size?: CardSize;
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

const ProfileCardFront: React.FC<
  { profile: ProfileResponse; gender: Gender; size: CardSize }
> = ({ profile, gender, size }) => {
  const config = genderConfig[gender];
  const displayYear = profile.birthYear.toString();
  const isSmall = size === "S";

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3",
        isSmall ? "px-2 py-3" : "px-3 pt-5 pb-4",
      )}
    >
      <div
        className="flex flex-col items-center gap-1 w-full px-1"
      >
        <p
          className={cn(
            "text-label-neutral font-medium leading-tight whitespace-nowrap",
            isSmall ? "text-[10px]" : "text-xs",
          )}
        >
          {displayYear}년생 · {animalDisplayMap[profile.animal]}상
        </p>
        <p
          className={cn(
            "text-label-strong font-semibold leading-tight whitespace-nowrap",
            isSmall ? "text-base" : "text-xl",
          )}
        >
          {profile.nickname}
        </p>
      </div>

      <div
        className={cn(
          "flex items-center justify-center w-full",
          isSmall ? "h-[80px]" : "h-[126px]",
        )}
      >
        <AnimalImage
          animalType={profile.animal}
          gender={gender}
          className={cn(
            "object-contain",
            isSmall ? "max-h-[80px]" : "max-h-[126px]",
          )}
        />
      </div>

      <div className="flex gap-1 items-center justify-center w-full">
        <span
          className={cn(
            config.tagBg,
            config.tagText,
            "rounded-lg font-medium whitespace-nowrap",
            isSmall ? "px-2 py-1 text-[10px]" : "px-2.5 py-1.5 text-xs",
          )}
        >
          #{profile.mbti}
        </span>
        {profile.department && (
          <span
            className={cn(
              config.tagBg,
              config.tagText,
              "rounded-lg font-medium whitespace-nowrap",
              isSmall ? "px-2 py-1 text-[10px]" : "px-2.5 py-1.5 text-xs",
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
              "rounded-lg font-medium whitespace-nowrap",
              isSmall ? "px-2 py-1 text-[10px]" : "px-2.5 py-1.5 text-xs",
            )}
          >
            #{styleLabelMap[profile.style]}
          </span>
        )}
      </div>
    </div>
  );
};

const ProfileCardBack: React.FC<
  { profile: ProfileResponse; contact?: string; size: CardSize; gender: Gender }
> = ({ profile, contact, size, gender }) => {
  const isSmall = size === "S";

  if (contact) {
    return (
      <div className={cn("flex flex-col items-center gap-3 px-3", isSmall ? "pt-4 pb-3" : "pt-6 pb-4")}>
        <div className="flex flex-col items-center gap-1 w-full px-1">
          <p className="text-label-neutral font-medium text-xs leading-tight whitespace-nowrap">
            {profile.birthYear}년생 ·{" "}
            {animalDisplayMap[profile.animal]}상
          </p>
          <p className="text-label-strong font-semibold text-xl leading-tight whitespace-nowrap">
            {profile.nickname}
          </p>
        </div>

        <div className={cn("flex items-center justify-center w-full", isSmall ? "h-[80px]" : "h-[126px]")}>
          <AnimalImage
            animalType={profile.animal}
            gender={gender}
            className={cn("object-contain", isSmall ? "max-h-[80px]" : "max-h-[126px]")}
          />
        </div>

        <a
          href={
            contact.startsWith("@")
              ? `https://instagram.com/${contact.substring(1)}`
              : `tel:${contact}`
          }
          target="_blank"
          className="w-full flex justify-center items-center gap-1 p-4 bg-fill-pink-light border border-primary/20 rounded-2xl"
        >
          <span
            className={cn(
              "font-medium leading-5 text-primary text-center underline",
              isSmall ? "text-base" : "text-lg",
            )}
          >
            {contact}
          </span>
        </a>
        <p
          className={cn(
            "text-sm text-primary font-medium",
            isSmall && "hidden",
          )}
        >
          {contact.startsWith("@")
            ? "아이디를 누르면 인스타로 연결됩니다."
            : "번호를 누르면 연락처를 추가할 수 있습니다."}
        </p>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col items-center gap-3 px-3", isSmall ? "pt-4 pb-3" : "pt-6 pb-4")}>
      <div className="flex flex-col items-center gap-1 w-full px-1">
        <p className="text-label-neutral font-medium text-xs leading-tight whitespace-nowrap">
          {profile.birthYear}년생 ·{" "}
          {animalDisplayMap[profile.animal]}상
        </p>
        <p className="text-label-strong font-semibold text-xl leading-tight whitespace-nowrap">
          {profile.nickname}
        </p>
      </div>

      <div className={cn("flex items-center justify-center w-full", isSmall ? "h-[80px]" : "h-[126px]")}>
        <AnimalImage
          animalType={profile.animal}
          gender={gender}
          className={cn("object-contain", isSmall ? "max-h-[80px]" : "max-h-[126px]")}
        />
      </div>
    </div>
  );
};

const ProfileCardBody: React.FC<{ profile: ProfileResponse }> = ({
  profile,
}) => {
  return (
    <div className="bg-white rounded-3xl w-full px-3 py-2 flex flex-col justify-center">
      {profile.introSentences.map((sentence, index) => (
        <div
          key={index}
          className="flex flex-col gap-1.5 px-2 py-1.5 w-full"
        >
          <p className="text-label-neutral text-[10px] font-semibold leading-[1.35]">
            특징 {index + 1}
          </p>
          <p className="text-label-strong text-base font-medium leading-[1.35]">
            {sentence}
          </p>
        </div>
      ))}
    </div>
  );
};

const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  contact,
  className,
  side = "front",
  size = "L",
}) => {
  const gender: Gender = profile.gender;
  const config = genderConfig[gender];

  return (
    <div
      className={cn(
        config.cardBg,
        "rounded-[36px] overflow-hidden flex flex-col p-3 items-center w-full select-none",
        className,
      )}
    >
      {side === "front" ? (
        <>
          <ProfileCardFront
            profile={profile}
            size={size}
            gender={gender}
          />
          <ProfileCardBody profile={profile} />
        </>
      ) : (
        <ProfileCardBack
          profile={profile}
          contact={contact}
          size={size}
          gender={gender}
        />
      )}
    </div>
  );
};

export default ProfileCard;

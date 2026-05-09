import AnimalImage from "@/components/profile/AnimalImage";
import ProfileTags from "@/components/profile/ProfileTags";
import { animalDisplayMap } from "@/lib/animal";
import { cardBgConfig } from "@/lib/card";
import { cn, formatPhone } from "@/lib/utils";
import { toast } from "sonner";
import { Gender, ProfileResponse } from "@/types/profile";
import React from "react";

type CardSide = "front" | "back";
type CardSize = "L" | "S";

interface ProfileCardProps {
  profile: ProfileResponse;
  contact?: string;
  className?: string;
  side?: CardSide;
  size?: CardSize;
  compact?: boolean;
}

const ProfileCardFront: React.FC<{
  profile: ProfileResponse;
  gender: Gender;
  size: CardSize;
  compact?: boolean;
}> = ({ profile, gender, size, compact }) => {
  const displayYear = profile.birthYear.toString();
  const isSmall = size === "S";

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3 self-center",
        isSmall ? "px-2 py-3" : "px-3 pt-5 pb-4",
        compact &&
          "max-[400px]:px-2 max-[400px]:pt-3 max-[400px]:pb-2 max-[400px]:gap-2",
      )}
    >
      <div className="flex flex-col items-center gap-1 w-full px-1">
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
          isSmall ? "h-[80px]" : "h-[126px] max-[440px]:h-[100px]",
          compact && "max-[400px]:h-[80px]",
        )}
      >
        <AnimalImage
          animalType={profile.animal}
          gender={gender}
          className={cn(
            "object-contain",
            isSmall
              ? "max-h-[80px]"
              : "max-h-[126px] max-[440px]:max-h-[100px]",
            compact && "max-[400px]:max-h-[80px]",
          )}
        />
      </div>

      <ProfileTags profile={profile} gender={gender} size={size} />
    </div>
  );
};

const ProfileCardBack: React.FC<{
  profile: ProfileResponse;
  contact?: string;
  size: CardSize;
  gender: Gender;
}> = ({ profile, contact, size, gender }) => {
  const isSmall = size === "S";

  if (contact) {
    return (
      <div className="grow flex flex-col w-full">
        <div
          className={cn(
            "flex flex-col items-center gap-3 px-3",
            isSmall ? "pt-4 pb-3" : "pt-6 pb-4",
          )}
        >
          <div className="flex flex-col items-center gap-1 w-full px-1">
            <p className="text-label-neutral font-medium text-xs leading-tight whitespace-nowrap">
              {profile.birthYear}년생 · {animalDisplayMap[profile.animal]}상
            </p>
            <p className="text-label-strong font-semibold text-xl leading-tight whitespace-nowrap">
              {profile.nickname}
            </p>
          </div>

          <div
            className={cn(
              "flex items-center justify-center w-full",
              isSmall ? "h-[80px]" : "h-[126px] max-[440px]:h-[100px]",
            )}
          >
            <AnimalImage
              animalType={profile.animal}
              gender={gender}
              className={cn(
                "object-contain",
                isSmall
                  ? "max-h-[80px]"
                  : "max-h-[126px] max-[440px]:max-h-[100px]",
              )}
            />
          </div>

          <ProfileTags profile={profile} gender={gender} size={size} />
        </div>

        <div className="bg-white rounded-3xl w-full grow px-6 py-4 flex flex-col items-center justify-center gap-2">
          {contact.startsWith("@") ? (
            <a
              href={`https://instagram.com/${contact.substring(1)}`}
              target="_blank"
              className="w-full flex justify-center items-center px-2 py-3"
            >
              <span
                className={cn(
                  "text-label-strong font-medium leading-5 text-center underline",
                  isSmall ? "text-base" : "text-lg",
                )}
              >
                {contact}
              </span>
            </a>
          ) : (
            <button
              onClick={() => {
                navigator.clipboard.writeText(contact);
                toast.success("전화번호가 복사되었어요");
              }}
              className="w-full flex justify-center items-center px-2 py-3"
            >
              <span
                className={cn(
                  "text-label-strong font-medium leading-5 text-center underline",
                  isSmall ? "text-base" : "text-lg",
                )}
              >
                {formatPhone(contact)}
              </span>
            </button>
          )}
          {!isSmall && (
            <p className="text-label-neutral text-sm font-medium">
              {contact.startsWith("@")
                ? "아이디를 누르면 인스타로 연결됩니다."
                : "번호를 누르면 연락처를 추가할 수 있습니다."}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3 px-3",
        isSmall ? "pt-4 pb-3" : "pt-6 pb-4",
      )}
    >
      <div className="flex flex-col items-center gap-1 w-full px-1">
        <p className="text-label-neutral font-medium text-xs leading-tight whitespace-nowrap">
          {profile.birthYear}년생 · {animalDisplayMap[profile.animal]}상
        </p>
        <p className="text-label-strong font-semibold text-xl leading-tight whitespace-nowrap">
          {profile.nickname}
        </p>
      </div>

      <div
        className={cn(
          "flex items-center justify-center w-full",
          isSmall ? "h-[80px]" : "h-[126px] max-[440px]:h-[100px]",
        )}
      >
        <AnimalImage
          animalType={profile.animal}
          gender={gender}
          className={cn(
            "object-contain",
            isSmall
              ? "max-h-[80px]"
              : "max-h-[126px] max-[440px]:max-h-[100px]",
          )}
        />
      </div>

      <ProfileTags profile={profile} gender={gender} size={size} />
    </div>
  );
};

const ProfileCardBody: React.FC<{
  profile: ProfileResponse;
  compact?: boolean;
}> = ({ profile, compact }) => {
  return (
    <div
      className={cn(
        "bg-white rounded-3xl w-full px-3 py-2 flex flex-col justify-center",
        compact && "max-[400px]:py-1",
      )}
    >
      {profile.introSentences.map((sentence, index) => (
        <div key={index} className="flex flex-col gap-1.5 px-2 py-1.5 w-full">
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
  compact,
}) => {
  const gender: Gender = profile.gender;
  const cardBg = cardBgConfig[gender];

  return (
    <div
      className={cn(
        cardBg,
        "rounded-[36px] overflow-hidden flex flex-col p-3 items-stretch w-full select-none",
        compact && "max-[400px]:p-2",
        className,
      )}
    >
      {side === "front" ? (
        <>
          <ProfileCardFront
            profile={profile}
            size={size}
            gender={gender}
            compact={compact}
          />
          <ProfileCardBody profile={profile} compact={compact} />
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

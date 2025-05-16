import AnimalImage from "@/components/profile/AnimalImage";
import { Badge } from "@/components/ui/badge";
import { animalDisplayMap } from "@/lib/animal";
import { cn } from "@/lib/utils";
import { ProfileResponse } from "@/types/profile";
import { Heart } from "lucide-react";
import React from "react";

interface ProfileCardProps {
  profile: ProfileResponse;
  contact?: string;
  className?: string;
  size?: "full" | "small";
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  contact,
  className,
  size,
}) => {
  const shortenedYear = profile.birthYear.toString().slice(-2);
  return (
    <div
      className={cn(
        "profile-card-background rounded-4xl shadow-md overflow-hidden flex flex-col justify-center items-center gap-2 p-5 select-none",
        className,
      )}
    >
      <div className="flex flex-col items-center gap-2">
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
            className={cn(
              "w-full object-contain",
              size === "small" ? "max-h-[80px]" : "max-h-[140px]",
            )}
          />
        </div>
        <div className="flex flex-col items-stretch w-full">
          <div className="flex flex-col items-stretch gap-3 w-full">
            <div className="flex flex-col gap-1">
              <h3
                className={cn(
                  "text-foreground font-semibold leading-5 text-center w-full text-xl",
                  size === "small" && "text-base",
                )}
              >
                {profile.nickname}
              </h3>
              <p
                className={cn(
                  "text-muted-foreground text-center text-sm font-medium",
                  size === "small" && "text-xs",
                )}
              >
                {animalDisplayMap[profile.animal]}·{profile.mbti}
              </p>
            </div>
            {contact ? (
              <>
                <a
                  href={
                    contact.startsWith("@")
                      ? `https://instagram.com/${contact.substring(1)}`
                      : `tel:${contact}`
                  }
                  target="_blank"
                  className="w-full flex flex-row justify-center items-center gap-1 p-4 bg-[#FFF2F7] border border-[rgba(238,81,138,0.2)] rounded-2xl"
                >
                  <span
                    className={cn(
                      "font-medium leading-5 text-primary text-center underline text-lg",
                      size === "small" && "text-base",
                    )}
                  >
                    {contact}
                  </span>
                </a>
                <p
                  className={cn(
                    "text-sm text-primary font-medium",
                    size === "small" && "hidden",
                  )}
                >
                  {contact.startsWith("@")
                    ? "아이디를 누르면 인스타로 연결됩니다."
                    : "번호를 누르면 연락처를 추가할 수 있습니다."}
                </p>
              </>
            ) : (
              <div className="flex flex-col items-stretch gap-1 w-full">
                {profile.introSentences.map((sentence, index) => (
                  <p
                    key={index}
                    className={cn(
                      "text-foreground font-medium text-start w-full",
                      size === "small" && "text-xs",
                    )}
                  >
                    {sentence}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;

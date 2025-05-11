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
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  contact,
  className,
}) => {
  return (
    <div
      className={cn(
        "profile-card-background rounded-4xl shadow-md overflow-hidden flex flex-col justify-center items-center gap-2 p-5 select-none",
        className
      )}
    >
      <div className="flex flex-col items-center gap-4">
        <Badge
          variant="outline"
          className={cn(
            "profile-badge rounded-full px-3 py-1 flex justify-center items-center gap-1",
            profile.gender === "MALE"
              ? "border-blue/50 text-blue"
              : "border-primary/50 text-primary"
          )}
        >
          {animalDisplayMap[profile.animal]}상
          <Heart
            className={cn(
              "size-2",
              profile.gender === "MALE" ? "fill-blue" : "fill-primary"
            )}
          />
          {profile.mbti}
        </Badge>
        <div className="flex flex-col items-center w-full">
          <AnimalImage
            animalType={profile.animal}
            className="w-full max-w-[230px]"
          />
        </div>
        <div className="flex flex-col items-stretch w-full">
          <div className="flex flex-col items-stretch gap-3 w-full">
            <h3 className="text-foreground text-xl font-semibold leading-5 text-center w-full">
              {profile.nickname}
            </h3>
            {contact ? (
              <div className="w-full flex flex-row justify-center items-center gap-1 p-4 bg-[#FFF2F7] border border-[rgba(238,81,138,0.2)] rounded-2xl">
                <span className="text-lg font-medium leading-5 text-primary text-center">
                  {contact}
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-stretch gap-2 w-full">
                {profile.introSentences.map((sentence, index) => (
                  <p
                    key={index}
                    className="text-foreground font-medium leading-5 text-start w-full"
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

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
        "profile-card-background rounded-[30px] shadow-md overflow-hidden flex flex-col justify-center items-center gap-[8.61px] p-[20px_20px_15px]",
        className
      )}
    >
      <div className="flex flex-col items-center gap-[15px] w-[245.47px]">
        <Badge
          variant="outline"
          className="profile-badge rounded-[50px] px-[13px] py-[4px] flex justify-center items-center gap-[3px] text-primary"
        >
          {animalDisplayMap[profile.animal]}상
          <Heart className="fill-pink size-2" />
          {profile.mbti}
        </Badge>
        <div className="flex flex-col items-stretch gap-[-5px] w-full">
          <div className="flex flex-col items-stretch w-full">
            <div className="flex flex-col items-center w-full">
              <AnimalImage animalType={profile.animal} className="w-full" />
            </div>
          </div>
          <div className="flex flex-col items-stretch gap-[5px] w-full">
            <div className="flex flex-col items-stretch w-full">
              <div className="px-[6.89px] flex flex-col items-stretch gap-[7.75px] w-full">
                <h3 className="text-[#404040] text-[24.97px] font-semibold leading-[1.3em] tracking-[-1%] text-center w-full">
                  {profile.nickname}
                </h3>
              </div>
            </div>

            {contact ? (
              <div className="w-full flex flex-row justify-center items-center gap-[4px] px-[16px] py-4 bg-[#FFF2F7] border border-[rgba(238,81,138,0.2)] rounded-[16px]">
                <span className="text-[18px] font-medium leading-[1.3em] tracking-[-1%] text-[#EE518A] text-center">
                  {contact}
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-stretch gap-[10px] p-[8.61px_10.34px] w-full">
                {profile.introSentences.map((sentence, index) => (
                  <div
                    key={index}
                    className="flex flex-row justify-stretch items-stretch gap-[8.61px] w-full"
                  >
                    <div className="flex flex-row justify-stretch items-stretch gap-[8.61px] w-full">
                      <p className="text-[#525252] text-[16px] font-medium leading-[1.3em] tracking-[-1%] text-left w-full">
                        {sentence}
                      </p>
                    </div>
                  </div>
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

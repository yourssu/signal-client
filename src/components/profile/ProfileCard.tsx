import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ProfileResponse } from "@/types/profile";
import React from "react";

interface ProfileCardProps {
  profile: ProfileResponse;
  contact?: string;
  className?: string;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile, className }) => {
  return (
    <div
      className={cn(
        "profile-card-background rounded-[30px] shadow-md overflow-hidden flex flex-col justify-center items-center gap-[8.61px] p-[20px_20px_15px]",
        className
      )}
    >
      {/* Frame 1000011852 */}
      <div className="flex flex-col items-center gap-[15px] w-[245.47px]">
        {/* Frame 1000011906 (Badges) */}
        <div className="profile-badge rounded-[50px] px-[13px] py-[4px] flex justify-center items-center gap-[3px]">
          {/* 00상 Badge */}
          <Badge className="profile-badge text-[#EE518A] font-pretendard text-[14px] font-medium leading-[1.3em] tracking-[-1%] p-0 bg-transparent border-none">
            {profile.animal}상 {/* Assuming animal type maps to 00상 */}
          </Badge>
          {/* Heart Icon - TODO: Add Heart Icon SVG */}
          {/* MBTI Badge */}
          <Badge className="profile-badge text-[#EE518A] font-pretendard text-[14px] font-medium leading-[1.3em] tracking-[-1%] p-0 bg-transparent border-none">
            {profile.mbti}
          </Badge>
        </div>

        {/* Frame 1000011851 (Image and Text) */}
        <div className="flex flex-col items-stretch gap-[-5px] w-full">
          {/* Frame 1000011912 (Image) */}
          <div className="flex flex-col items-center items-stretch w-full">
            {/* Frame 1000011849 (Image Group) */}
            <div className="flex flex-col items-center items-stretch w-full">
              {/* Group 1000011822 (Image Placeholder) */}
              <div className="w-[100px] h-[100px] bg-gray-300 rounded-full flex items-center justify-center">
                {/* TODO: Implement image display based on profile data */}
                <span className="text-gray-600 text-sm">Image Placeholder</span>
              </div>
            </div>
          </div>

          {/* Frame 1000011850 (Text) */}
          <div className="flex flex-col items-stretch gap-[5px] w-full">
            {/* Frame 1000011848 (Nickname) */}
            <div className="flex flex-col items-stretch w-full">
              {/* Frame 1000011836 (Nickname Text) */}
              <div className="px-[6.89px] flex flex-col items-stretch gap-[7.75px] w-full">
                <h3 className="text-[#404040] font-pretendard text-[24.97px] font-semibold leading-[1.3em] tracking-[-1%] text-center w-full">
                  {profile.nickname}
                </h3>
              </div>
            </div>

            {/* Frame 1000011823 (Intro Sentences) */}
            <div className="flex flex-col items-stretch gap-[10px] p-[8.61px_10.34px] w-full">
              {profile.introSentences.map((sentence, index) => (
                // Frame 1000011835/1000011837/1000011838 (Intro Sentence)
                <div
                  key={index}
                  className="flex flex-row justify-stretch items-stretch gap-[8.61px] w-full"
                >
                  {/* Frame 1000011836 (Intro Sentence Text) */}
                  <div className="flex flex-row justify-stretch items-stretch gap-[8.61px] w-full">
                    <p className="text-[#525252] font-pretendard text-[16px] font-medium leading-[1.3em] tracking-[-1%] text-left w-full">
                      {sentence}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;

import { cn } from "@/lib/utils";
import { EgenTetoType, Gender, ProfileResponse } from "@/types/profile";

type ProfileWithTags = Pick<ProfileResponse, "mbti" | "department" | "egenTeto">;

interface ProfileTagsProps {
  profile: ProfileWithTags;
  gender: Gender;
  size?: "L" | "S";
}

const genderTagConfig: Record<
  Gender,
  { tagBg: string; tagText: string }
> = {
  MALE: {
    tagBg: "bg-fill-blue",
    tagText: "text-secondary-strong",
  },
  FEMALE: {
    tagBg: "bg-fill-pink",
    tagText: "text-primary",
  },
};

const egenTetoLabelMap: Record<EgenTetoType, string> = {
  TETO: "테토",
  EGEN: "에겐",
};

const ProfileTags: React.FC<ProfileTagsProps> = ({ profile, gender, size = "L" }) => {
  const isSmall = size === "S";
  const config = genderTagConfig[gender];

  return (
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
      {profile.egenTeto && (
        <span
          className={cn(
            "bg-fill-pink text-primary",
            "rounded-lg font-medium whitespace-nowrap",
            isSmall ? "px-2 py-1 text-[10px]" : "px-2.5 py-1.5 text-xs",
          )}
        >
          #{egenTetoLabelMap[profile.egenTeto]}
        </span>
      )}
    </div>
  );
};

export default ProfileTags;

import { cn } from "@/lib/utils";
import { Gender, ProfileResponse, StyleType } from "@/types/profile";

type ProfileWithTags = Pick<ProfileResponse, "mbti" | "department" | "style">;

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

const styleLabelMap: Record<StyleType, string> = {
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
  );
};

export default ProfileTags;

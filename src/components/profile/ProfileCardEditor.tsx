import AnimalImage from "@/components/profile/AnimalImage";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { animalDisplayMap } from "@/lib/animal";
import { cn } from "@/lib/utils";
import { ProfileResponse, ProfileUpdateRequest } from "@/types/profile";
import { Heart } from "lucide-react";
import React from "react";

interface ProfileCardEditorProps {
  profile: ProfileResponse;
  className?: string;
  onChange?: (update: ProfileUpdateRequest) => void;
}

const ProfileCardEditor: React.FC<ProfileCardEditorProps> = ({
  profile,
  className,
  onChange,
}) => {
  const shortenedYear = profile.birthYear.toString().slice(-2);

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.({
      nickname: e.target.value,
      introSentences: profile.introSentences,
    });
  };

  const handleIntroSentenceChange = (index: number, value: string) => {
    const newSentences = [...profile.introSentences];
    newSentences[index] = value;
    onChange?.({ nickname: profile.nickname, introSentences: newSentences });
  };
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
    </div>
  );
};

export default ProfileCardEditor;

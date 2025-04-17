import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ProfileResponse } from "@/types/profile";
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
        "bg-secondary rounded-xl shadow-md overflow-hidden h-96 flex flex-col justify-end items-start",
        className
      )}
    >
      <div className="p-6 flex flex-col gap-2">
        <div>
          <h3 className="text-4xl font-bold mb-2">{profile.nickname}</h3>
          {contact && <h4 className="text-2xl font-bold mb-2">{contact}</h4>}
          <div className="flex gap-2">
            <Badge className="rounded-2xl px-3">{profile.animal}</Badge>
            <Badge className="rounded-2xl px-3">{profile.mbti}</Badge>
          </div>
        </div>
        <ul className="flex flex-col gap-1">
          <li>Desc. 1</li>
          <li>Desc. 2</li>
          <li>Desc. 3</li>
        </ul>
      </div>
    </div>
  );
};

export default ProfileCard;

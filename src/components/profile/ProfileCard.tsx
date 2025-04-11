import React from "react";

export interface Profile {
  id: string;
  nickname: string;
  mbti: string;
  animal: string;
  gender: "male" | "female";
  contact: string;
}

interface ProfileCardProps {
  profile: Profile;
  onViewContact: () => void;
  onSkip: () => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  onViewContact,
  onSkip,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <div className="w-32 h-32 mx-auto bg-gray-200 rounded-full mb-4 flex items-center justify-center">
          <span className="text-4xl">{profile.animal[0]}</span>
        </div>

        <div className="text-center">
          <h3 className="text-xl font-bold mb-2">{profile.nickname}</h3>
          <p className="text-gray-600 mb-1">{profile.mbti}</p>
          <p className="text-gray-600">{profile.animal}</p>
        </div>
      </div>

      <div className="flex border-t border-gray-200">
        <button
          onClick={onSkip}
          className="flex-1 py-3 text-gray-600 hover:bg-gray-50 transition-colors border-r border-gray-200"
        >
          넘기기
        </button>
        <button
          onClick={onViewContact}
          className="flex-1 py-3 text-blue-500 hover:bg-blue-50 transition-colors"
        >
          연락처 보기
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;

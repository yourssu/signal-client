import React from "react";
import { useNavigate, useParams } from "react-router";
import { Profile } from "../../../components/profile/ProfileCard";

// Mock data - in a real app, this would come from an API
const mockProfiles: Record<string, Profile> = {
  "1": {
    id: "1",
    nickname: "멋쟁이",
    mbti: "ENFP",
    animal: "강아지",
    gender: "male",
    contact: "010-1234-5678",
  },
  "2": {
    id: "2",
    nickname: "귀요미",
    mbti: "INTJ",
    animal: "고양이",
    gender: "female",
    contact: "010-8765-4321",
  },
};

const ContactViewPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const profile = id ? mockProfiles[id] : null;

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">프로필을 찾을 수 없습니다</h2>
          <button
            onClick={() => navigate("/profile/list")}
            className="py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="w-32 h-32 mx-auto bg-gray-200 rounded-full mb-6 flex items-center justify-center">
            <span className="text-4xl">{profile.animal[0]}</span>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">{profile.nickname}</h2>
            <p className="text-gray-600 mb-1">{profile.mbti}</p>
            <p className="text-gray-600">{profile.animal}</p>
          </div>

          <div className="border-t border-b border-gray-200 py-4 mb-6">
            <h3 className="text-center text-lg font-medium mb-2">연락처</h3>
            <p className="text-center text-xl font-bold text-blue-500">
              {profile.contact}
            </p>
          </div>

          <div className="flex justify-center">
            <button
              onClick={() => navigate("/profile/list")}
              className="py-2 px-6 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              목록으로 돌아가기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactViewPage;

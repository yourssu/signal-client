import { useConsumeTicket } from "@/queries/profile";
import { userUuid } from "@/atoms/userUuid";
import { useAtom } from "jotai";
import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ProfileContactResponse } from "@/types/profile";

const ContactViewPage: React.FC = () => {
  const navigate = useNavigate();
  const { id: idStr } = useParams<{ id: string }>();
  const id = useMemo(() => Number(idStr), [idStr]);
  const [uuid] = useAtom(userUuid);
  const { mutateAsync } = useConsumeTicket();
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [profile, setProfile] = useState<ProfileContactResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  const handleConfirm = async () => {
    try {
      const res = await mutateAsync({
        profileId: id,
        uuid,
      });
      setIsConfirmed(true);
      setError(null);
      setProfile(res.result);
    } catch (e) {
      console.log(e);
      setError("이용권이 부족합니다.");
    }
  };

  const renderContent = () => {
    if (!isConfirmed) {
      return (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">연락처 열람</h2>
          <p className="mb-6 text-gray-600">
            {profile.nickname}님의 연락처를 열람하시겠습니까?
          </p>
          <div className="space-x-4">
            <button
              onClick={handleConfirm}
              className="py-2 px-6 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              확인
            </button>
            <button
              onClick={() => navigate("/profile/list")}
              className="py-2 px-6 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              취소
            </button>
          </div>
          {error && <p className="mt-4 text-red-500 font-medium">{error}</p>}
        </div>
      );
    }

    return (
      <>
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
      </>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">{renderContent()}</div>
      </div>
    </div>
  );
};

export default ContactViewPage;

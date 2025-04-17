import { useConsumeTicket } from "@/hooks/queries/profiles";
import { userUuid } from "@/atoms/userUuid";
import { useAtom } from "jotai";
import React, { useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { ProfileContactResponse, ProfileResponse } from "@/types/profile";
import { Button } from "@/components/ui/button";
import ProfileCard from "@/components/profile/ProfileCard";

const ContactViewPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id: idStr } = useParams<{ id: string }>();
  const { profile } = location.state as { profile: ProfileResponse };
  const id = useMemo(() => Number(idStr), [idStr]);
  const [uuid] = useAtom(userUuid);
  const { mutateAsync } = useConsumeTicket();
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [profileContact, setProfileContact] =
    useState<ProfileContactResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    try {
      const res = await mutateAsync({
        profileId: id,
        uuid,
      });
      setIsConfirmed(true);
      setError(null);
      setProfileContact(res.result);
    } catch (e) {
      console.log(e);
      setError("이용권이 부족합니다.");
    }
  };

  const renderContent = () => {
    if (!isConfirmed) {
      return (
        <div className="text-center">
          <p className="mb-6 text-gray-600 text-lg">
            <span className="text-primary">
              이용권을 2개 소모해
              <br />
            </span>
            {profile.nickname}님의 연락처를 열람하시겠습니까?
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              onClick={handleConfirm}
              size="xl"
              className="py-2 px-6 grow"
            >
              확인
            </Button>
            <Button
              variant="secondary"
              onClick={() => navigate("/profile")}
              size="xl"
              className="grow"
            >
              취소
            </Button>
          </div>
          {error && <p className="mt-4 text-red-500 font-medium">{error}</p>}
        </div>
      );
    }

    return (
      profileContact && (
        <>
          <ProfileCard
            profile={profile}
            contact={profileContact.contact}
            className="w-full"
          />
          <Button
            onClick={() => navigate("/profile")}
            size="xl"
            className="w-full rounded-2xl"
          >
            다른 시그널 보내기
          </Button>
        </>
      )
    );
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-center gap-12 p-4">
      {renderContent()}
    </div>
  );
};

export default ContactViewPage;

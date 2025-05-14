import { useConsumeTicket } from "@/hooks/queries/profiles";
import React, { useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router";
import { ProfileContactResponse, ProfileResponse } from "@/types/profile";
import { Button, buttonVariants } from "@/components/ui/button";
import { useUserUuid } from "@/hooks/useUserUuid";
import { cn } from "@/lib/utils";
import TopBar from "@/components/TopBar";
import { useAtomValue, useSetAtom } from "jotai";
import {
  contactedProfilesAtom,
  contactProfileAtom,
} from "@/atoms/viewerProfiles";
import TurnableProfileCard from "@/components/profile/TurnableProfileCard";
import { TICKET_COST } from "@/env";

const ContactViewPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const idStr = params.get("id") ?? "";

  const from = params.get("from") ?? "profile";
  const returnLink = from === "saved" ? "/profile/saved" : "/profile";

  const { profile } = location.state as { profile: ProfileResponse };
  const id = useMemo(() => Number(idStr), [idStr]);
  const uuid = useUserUuid();
  const { mutateAsync } = useConsumeTicket();
  const contactedProfiles = useAtomValue(contactedProfilesAtom);
  const contactedProfile = contactedProfiles.find(
    (profile) => profile.profileId === id,
  );
  const addContact = useSetAtom(contactProfileAtom);
  const [isConfirmed, setIsConfirmed] = useState(
    contactedProfile !== undefined,
  );
  const [profileContact, setProfileContact] =
    useState<ProfileContactResponse | null>(contactedProfile ?? null);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    try {
      const res = await mutateAsync({
        profileId: id,
        uuid,
      });
      setIsConfirmed(true);
      setError(null);
      setProfileContact(res);
      addContact(res);
    } catch (e) {
      console.log(e);
      setError("이용권이 부족합니다.");
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const renderContent = () => {
    if (!isConfirmed) {
      return (
        <div className="text-center flex flex-col items-center justify-center grow">
          <div className="p-6 bg-background rounded-2xl shadow-md">
            <p className="mb-6 text-foreground text-lg">
              <span className="text-primary font-bold">
                이용권을 {TICKET_COST}개 소모해
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
        </div>
      );
    }

    return (
      profileContact && (
        <>
          <TopBar onBack={handleBack} />
          <div className="flex flex-col gap-4 items-center w-full max-w-md grow p-6">
            <div className="flex flex-col items-start w-full">
              <h1 className="text-2xl font-semibold text-stone-700">
                <span className="text-primary">시그널 성공</span>
                <br />
                지금 바로 연결해보세요
              </h1>
            </div>
            <div className="grow flex flex-col justify-center items-stretch w-full">
              <TurnableProfileCard
                profile={profile}
                contact={profileContact.contact}
                isFlipped={true}
              />
            </div>
            <Link
              to={returnLink}
              className={cn(
                buttonVariants({ size: "xl" }),
                "w-full rounded-2xl",
              )}
            >
              다른 시그널 보내기
            </Link>
          </div>
        </>
      )
    );
  };

  return (
    <div className="h-full w-full flex flex-col items-center">
      {renderContent()}
    </div>
  );
};

export default ContactViewPage;

import { useConsumeTicket } from "@/hooks/queries/profiles";
import React, { useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router";
import { ProfileContactResponse, ProfileResponse } from "@/types/profile";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import TopBar from "@/components/Header";
import { useAtomValue, useSetAtom } from "jotai";
import {
  contactedProfilesAtom,
  contactProfileAtom,
} from "@/atoms/viewerProfiles";
import TurnableProfileCard from "@/components/profile/TurnableProfileCard";
import { ENABLE_SAVED, TICKET_COST } from "@/env";
import { buttonClick, viewContact } from "@/lib/analytics";
import { useViewerSelf } from "@/hooks/queries/viewers";
import { useQueryClient } from "@tanstack/react-query";
import { useUserInfo } from "@/hooks/queries/users";

const ContactViewPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const queryClient = useQueryClient();

  const idStr = params.get("id") ?? "";
  const from = params.get("from") ?? "profile";

  const id = useMemo(() => Number(idStr), [idStr]);
  const returnLink = from === "saved" ? "/profile/saved" : "/profile";

  const { data: userInfo } = useUserInfo();
  const uuid = userInfo?.uuid;
  const contactedProfiles = useAtomValue(contactedProfilesAtom);
  const addContact = useSetAtom(contactProfileAtom);

  const profile = (location.state as { profile: ProfileResponse | null } | null)
    ?.profile;
  const { data: viewerSelf } = useViewerSelf();
  const { mutateAsync } = useConsumeTicket();

  const contactedProfile = contactedProfiles.find(
    (profile) => profile.profileId === id,
  );

  const [isConfirmed, setIsConfirmed] = useState(
    contactedProfile !== undefined,
  );
  const [profileContact, setProfileContact] =
    useState<ProfileContactResponse | null>(contactedProfile ?? null);
  const [error, setError] = useState<string | null>(null);

  const handleCancel = () => {
    buttonClick("cancel_view_content", "이용권 열람 취소");
    navigate("/profile");
  };

  const handleConfirm = async () => {
    try {
      const res = await mutateAsync({
        profileId: id,
      });
      await queryClient.invalidateQueries({
        queryKey: ["viewer", "uuid", uuid],
      });
      if (viewerSelf) viewContact(res, viewerSelf);
      setIsConfirmed(true);
      setError(null);
      setProfileContact(res);
      addContact(res);
    } catch (e) {
      console.error(e);
      navigate(`/purchase?return_id=${id}`);
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
              {profile?.nickname ? `${profile.nickname} 님의` : ""} 연락처를
              열람하시겠습니까?
            </p>
            <div className="flex gap-4 justify-center">
              <Button
                variant="secondary"
                onClick={handleCancel}
                size="xl"
                className="grow"
              >
                취소
              </Button>
              <Button
                onClick={handleConfirm}
                size="xl"
                className="py-2 px-6 grow"
              >
                확인
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
                profile={profileContact}
                contact={profileContact.contact}
                isFlipped={true}
              />
            </div>
            <div className="flex flex-row flex-wrap gap-4 w-full max-w-md">
              {!ENABLE_SAVED && (
                <Link
                  to={"/profile/saved"}
                  className={cn(
                    buttonVariants({ variant: "secondary", size: "xl" }),
                    "rounded-2xl text-primary grow",
                  )}
                >
                  보낸 시그널 목록
                </Link>
              )}
              <Link
                to={returnLink}
                className={cn(
                  buttonVariants({ size: "xl" }),
                  "rounded-2xl grow",
                )}
              >
                다른 시그널 보내기
              </Link>
            </div>
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

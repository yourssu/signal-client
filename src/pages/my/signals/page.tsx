import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import TopBar from "@/components/Header";
import ContactReportDialog from "@/components/my/ContactReportDialog";
import { ProfileResponse } from "@/types/profile";
import { ScrollableCards } from "@/components/my/saved/ScrollableCards";
import { ENABLE_SAVED } from "@/env";
import main from "@/assets/home/main.png";
import { useUser } from "@/hooks/useUser";
import {
  getReportErrorMessage,
  useCreateReport,
} from "@/hooks/queries/reports";
import { profileReportClick } from "@/lib/analytics";

const ContactedProfilesPage: React.FC = () => {
  const navigate = useNavigate();
  const { purchasedProfiles } = useUser();

  const [profile, setProfile] = useState<
    (ProfileResponse & { contact?: string }) | null
  >(purchasedProfiles?.[0] || null);

  // Update profile state when index changes

  const [isReportOpen, setIsReportOpen] = useState(false);
  const { mutate: createReport, isPending: isReporting } = useCreateReport();

  const count = `${purchasedProfiles?.length ?? 0}`.padStart(2, "0");

  const handleReportClick = () => {
    if (!profile) return;
    profileReportClick({
      targetUserId: profile.profileId,
      sourcePage: "my_page",
      targetUserContactAdress: profile.contact ?? "",
    });
    setIsReportOpen(true);
  };

  const handleReportConfirm = () => {
    if (!profile) return;
    createReport(
      { profileId: profile.profileId },
      {
        onSuccess: () => {
          setIsReportOpen(false);
          toast.success("제보해 주셔서 감사해요! 확인 후 티켓이 지급돼요");
        },
        onError: (error) => {
          // 이미 제보했거나 열람하지 않은 프로필은 다시 눌러도 소용없다.
          setIsReportOpen(false);
          toast.error(getReportErrorMessage(error));
        },
      },
    );
  };

  return (
    <div className="w-full h-full flex flex-col items-center">
      <title>내가 보낸 시그널 - 시그널</title>
      <TopBar onBack={() => navigate(-1)} />
      {profile ? (
        <>
          <div className="flex flex-col gap-4 items-center w-full max-w-md grow py-6">
            <div className="flex flex-col items-start w-full px-6">
              {ENABLE_SAVED ? (
                <h1 className="text-2xl font-semibold text-stone-700">
                  내 마음 속에 <span className="text-primary">{count}명</span>이
                  <br />
                  저장되어 있어요
                </h1>
              ) : (
                <h1 className="text-2xl font-semibold text-stone-700">
                  <span className="text-primary">{count}명</span>에게
                  <br />
                  시그널을 보냈어요
                </h1>
              )}
            </div>
            <ScrollableCards
              profiles={purchasedProfiles ?? []}
              selectedId={profile?.profileId}
              onSelect={setProfile}
            />
            <p className="caption1 text-label-strong text-center">
              카드를 클릭하면 카드를 뒤집을 수 있어요.
            </p>
            <p className="caption1 text-label-alternative text-center">
              등록된 아이디가 이상하다면?{" "}
              <button
                type="button"
                onClick={handleReportClick}
                className="underline"
              >
                제보하기
              </button>
            </p>
          </div>
          <ContactReportDialog
            open={isReportOpen}
            onOpenChange={setIsReportOpen}
            onConfirm={handleReportConfirm}
            confirmDisabled={isReporting}
          />
        </>
      ) : (
        <>
          <div className="flex flex-col gap-4 items-center w-full max-w-md grow p-6">
            <div className="flex flex-col items-center justify-center w-full grow">
              <h1 className="text-2xl font-semibold text-stone-700">
                아직 보낸 시그널이 없어요
              </h1>
              <p>지금 바로 당신의 첫 시그널을 보내볼까요?</p>
              <div className="w-full max-w-[280px]">
                <img src={main} alt="Cat Character" className="w-full h-auto" />
              </div>
            </div>
            <div className="flex gap-4 w-full relative z-50">
              <Button
                variant="secondary"
                size="xl"
                className="basis-1/3 rounded-3xl text-primary"
                asChild
              >
                <Link to="/">홈으로</Link>
              </Button>
              <Button size="xl" className="grow rounded-3xl" asChild>
                <Link to="/profile">시그널 보내기</Link>
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ContactedProfilesPage;

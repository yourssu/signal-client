import React, { useEffect } from "react";
import { Link } from "react-router";
import TopBar from "@/components/Header";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import userIcon from "@/assets/icons/user_icon_mini.svg";
import archiveIcon from "@/assets/icons/file.svg";
import { ProfileAnalysisCard } from "@/components/my/ProfileAnalysisCard";
import { useAtomValue } from "jotai";
import { providerAtom } from "@/atoms/authTokens";
import { useUser } from "@/hooks/useUser";
import { cn } from "@/lib/utils";
import { ENABLE_PROFILE_VIEW } from "@/env";
import { mypageView } from "@/lib/analytics";

const MyPage: React.FC = () => {
  const { profile, viewer } = useUser();
  const ticketCount = (viewer?.ticket ?? 0) - (viewer?.usedTicket ?? 0);
  const provider = useAtomValue(providerAtom) ?? "local";
  const isLoggedIn = provider !== "local";

  useEffect(() => {
    if (!profile && !isLoggedIn) {
      mypageView("unregistered");
    } else if (profile && !isLoggedIn) {
      mypageView("registered_nonlogin");
    } else {
      mypageView("registered_login");
    }
  }, [profile, isLoggedIn]);

  return (
    <div className="w-full h-full flex flex-col items-center bg-neutral-100">
      <title>마이페이지 - 시그널</title>
      <TopBar onBack="/" hideInfo />
      <div className="flex flex-col gap-4 items-center w-full max-w-md grow p-6">
        <div className="flex flex-col items-start w-full">
          <h1 className="text-2xl font-semibold text-stone-700">마이페이지</h1>
        </div>

        {/* Profile Analysis Card */}
        {(ENABLE_PROFILE_VIEW || !isLoggedIn || !profile) && (
          <ProfileAnalysisCard
            isLoggedIn={isLoggedIn}
            isProfileRegistered={!!profile}
          />
        )}

        {/* Ticket Info Card */}
        <div
          className={cn(
            "bg-white rounded-2xl px-4 pt-3 pb-3.5 w-full flex items-center justify-between",
            !ENABLE_PROFILE_VIEW && "hidden",
          )}
        >
          <p className="h4 text-label-neutral">남은 이용권</p>
          <div className="flex items-center gap-3">
            <p className="h4 text-label-strong">{ticketCount}장</p>
            <Button
              variant="default"
              className="button-s rounded-lg px-3 py-1.5 h-auto"
              asChild
            >
              <Link
                to="/purchase?source=my_page"
>
                충전
              </Link>
            </Button>
          </div>
        </div>

        {/* Menu Options */}
        <div className="bg-white rounded-2xl px-4 py-3 w-full flex flex-col gap-2.5">
          <p className="caption2 text-label-neutral">나의 정보</p>
          {profile && (
            <Link
              to="/my/profile"
              className="flex items-center justify-between w-full py-1 cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <img src={userIcon} alt="프로필" className="size-4" />
                <span className="caption1 text-label-neutral">
                  내 프로필 보기
                </span>
              </div>
              <ChevronRight className="size-5 text-label-neutral" />
            </Link>
          )}
          {ENABLE_PROFILE_VIEW && (
            <Link
              to="/my/signals"
              className="flex items-center justify-between w-full py-1 cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <img src={archiveIcon} alt="구매 목록" className="size-4" />
                <span className="caption1 text-label-neutral">
                  구매한 프로필 목록
                </span>
              </div>
              <ChevronRight className="size-5 text-label-neutral" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyPage;

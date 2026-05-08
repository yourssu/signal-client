import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import main from "@/assets/home/main.png";
import signalTextSvg from "@/assets/home/signal_text.svg";
import { useCountProfile } from "@/hooks/queries/profiles";
import { ServiceDisabledDialog } from "@/components/home/ServiceDisabledDialog";
import {
  DISABLED_PROFILE_VIEW_DESC,
  DISABLED_REGISTER_DESC,
  ENABLE_PROFILE_VIEW,
  ENABLE_REGISTER,
  NOTICE,
} from "@/env";
import {
  profileRegisterClick,
  signalSendClick,
  myprofileView,
} from "@/lib/analytics";

interface MainContentProps {
  profileRegistered: boolean;
}

const MainContent = ({ profileRegistered }: MainContentProps) => {
  const { data } = useCountProfile();
  const count = React.useMemo(() => data?.count ?? 0, [data?.count]);
  const [registerGuardOpen, setRegisterGuardOpen] = useState(false);
  const [viewGuardOpen, setViewGuardOpen] = useState(false);

  return (
    <div className="flex flex-col items-center justify-between flex-1 px-[18px] pb-8 grow">
      <div className="entry_content flex flex-col items-center gap-3 w-[300px] my-auto">
        <div className="flex flex-col gap-2 items-center text-center w-[234px]">
          <p className="text-sm font-semibold text-[#70757d] leading-[1.35]">
            숭실대생을 위한 소개팅 서비스
          </p>
          <div className="flex flex-col gap-1 items-center whitespace-nowrap">
            <div className="flex gap-1 items-center justify-center">
              <img src={signalTextSvg} alt="시그널" className="h-[34px]" />
              <span className="text-2xl font-semibold text-[#212225] leading-[1.25]">
                을 보내면
              </span>
            </div>
            <p className="text-2xl font-semibold text-[#212225] leading-[1.25]">
              운명의 상대와 연결돼요
            </p>
          </div>
        </div>
        <div className="size-[250px]">
          <img src={main} alt="Main Character" className="w-full h-auto" />
        </div>
      </div>

      <div className="flex flex-col gap-2 items-center w-full">
        <p className="text-sm font-semibold text-center">
          <span className="text-primary">{count}명</span>
          <span className="text-[#525252]">이 당신을 기다리고 있어요</span>
        </p>
        {NOTICE && <p className="text-xs font-medium">{NOTICE}</p>}

        <div className="flex flex-col gap-2 w-full">
          {ENABLE_REGISTER ? (
            profileRegistered ? (
              <Link
                to="/my/profile"
                onClick={() => myprofileView("main")}
                className="flex h-14 items-center justify-center rounded-2xl bg-[#ffe7fa] backdrop-blur-[6.5px] text-base font-semibold text-primary hover:bg-[#ffd4f3] transition-colors"
              >
                내 프로필 보기
              </Link>
            ) : (
              <Link
                to="/profile/register"
                onClick={() => profileRegisterClick()}
                className="flex h-14 items-center justify-center rounded-2xl bg-[#ffe7fa] backdrop-blur-[6.5px] text-base font-semibold text-primary hover:bg-[#ffd4f3] transition-colors"
              >
                프로필 등록하기
              </Link>
            )
          ) : (
            <Button
              className="flex h-14 items-center justify-center rounded-2xl bg-[#ffe7fa] backdrop-blur-[6.5px] text-base font-semibold text-primary hover:bg-[#ffd4f3]"
              onClick={() => {
                profileRegisterClick();
                setRegisterGuardOpen(true);
              }}
            >
              프로필 등록하기
            </Button>
          )}

          {ENABLE_PROFILE_VIEW ? (
            <Link
              to="/profile"
              onClick={() => signalSendClick(profileRegistered)}
              className="flex h-14 items-center justify-center rounded-2xl bg-[#ff71b6] backdrop-blur-[6.5px] text-base font-semibold text-white hover:bg-[#ff5aa8] transition-colors"
            >
              시그널 보내기
            </Link>
          ) : (
            <Button
              className="flex h-14 items-center justify-center rounded-2xl bg-[#ff71b6] backdrop-blur-[6.5px] text-base font-semibold text-white hover:bg-[#ff5aa8]"
              onClick={() => {
                signalSendClick(profileRegistered);
                setViewGuardOpen(true);
              }}
            >
              시그널 보내기
            </Button>
          )}

          <p className="text-xs font-medium text-[#8c8c8c] text-center">
            <Link to="/privacy" className="underline">개인정보처리방침</Link>
            <span> 및 </span>
            <Link to="/terms" className="underline">이용약관</Link>
          </p>
        </div>
      </div>
      <ServiceDisabledDialog
        open={registerGuardOpen}
        onOpenChange={() => setRegisterGuardOpen(false)}
        title="큐피드 납치 중...♥"
        content={DISABLED_REGISTER_DESC}
      />
      <ServiceDisabledDialog
        open={viewGuardOpen}
        onOpenChange={() => setViewGuardOpen(false)}
        title="큐피드 납치 중...♥"
        content={DISABLED_PROFILE_VIEW_DESC}
      />
    </div>
  );
};

export default MainContent;

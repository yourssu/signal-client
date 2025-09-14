import React, { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Link } from "react-router";
import main from "@/assets/home/main.png";
import { useCountProfile } from "@/hooks/queries/profiles";
import { cn } from "@/lib/utils";
import { ServiceDisabledDialog } from "@/components/home/ServiceDisabledDialog";
import {
  DISABLED_PROFILE_VIEW_DESC,
  DISABLED_REGISTER_DESC,
  ENABLE_PROFILE_VIEW,
  ENABLE_REGISTER,
  NOTICE,
} from "@/env";
import { buttonClick } from "@/lib/analytics";

interface MainContentProps {
  profileRegistered: boolean;
  verifyNeeded: boolean;
}

const MainContent = ({ profileRegistered }: MainContentProps) => {
  const { data } = useCountProfile();
  const count = React.useMemo(() => data?.count ?? 0, [data?.count]);
  const [registerGuardOpen, setRegisterGuardOpen] = useState(false);
  const [viewGuardOpen, setViewGuardOpen] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center flex-1 p-6 grow gap-5">
      {/* Top section with title and subtitle */}
      <div className="flex flex-col items-center gap-2 py-4">
        <p className="text-primary font-semibold text-sm leading-tight">
          숭실대생을 위한 소개팅 서비스, 시그널
        </p>
        <h1 className="text-3xl font-semibold text-center leading-tight text-black-600">
          시그널을 보내면
          <br />
          운명의 상대와 연결돼요
        </h1>
      </div>

      {/* Middle section with image */}
      <div className="w-full max-w-[280px]">
        <img src={main} alt="Cat Character" className="w-full h-auto" />
      </div>

      {/* Text section before buttons */}
      <div className="flex flex-col w-full gap-1 text-center grow">
        <p className="text-black-600 text-base font-medium">
          <span className="text-primary">{count}명</span>이 당신을 기다리고
          있어요
        </p>
        <p className="text-muted-foreground text-xs font-medium">
          '시그널 보내기'를 눌러 마음을 전달하세요
        </p>
        {NOTICE && <p className="text-xs font-medium">{NOTICE}</p>}
      </div>

      {/* Button section */}
      <div className="flex flex-col items-stretch gap-4 w-full">
        {ENABLE_REGISTER ? (
          profileRegistered ? (
            <Link
              to="/my"
              onClick={() => buttonClick("view_my_profile", "내 프로필 보기")}
              className={cn(
                buttonVariants({ variant: "secondary" }),
                "h-14 text-lg rounded-2xl text-primary bg-[#FFF2F7] shadow-sm font-medium tracking-[-0.01em]",
              )}
            >
              내 프로필 보기
            </Link>
          ) : (
            <Link
              to="/profile/register"
              onClick={() => buttonClick("register_profile", "프로필 등록하기")}
              className={cn(
                buttonVariants({ variant: "secondary" }),
                "h-14 text-lg rounded-2xl text-primary bg-[#FFF2F7] shadow-sm font-medium tracking-[-0.01em]",
              )}
            >
              프로필 등록하기
            </Link>
          )
        ) : (
          <Button
            variant="secondary"
            className={cn(
              buttonVariants({ variant: "secondary" }),
              "h-14 text-lg rounded-2xl text-primary bg-[#FFF2F7] shadow-sm font-medium tracking-[-0.01em]",
            )}
            onClick={() => {
              buttonClick("register_profile_locked", "프로필 등록하기");
              setRegisterGuardOpen(true);
            }}
          >
            프로필 등록하기
          </Button>
        )}

        {ENABLE_PROFILE_VIEW ? (
          <Link
            to="/profile"
            onClick={() => buttonClick("send_signal", "시그널 보내기")}
            className={cn(
              buttonVariants({ variant: "default" }),
              "h-14 text-lg rounded-2xl bg-white text-primary hover:bg-white/90 font-medium tracking-[-0.01em]",
            )}
          >
            시그널 보내기
          </Link>
        ) : (
          <Button
            variant="default"
            className={cn(
              buttonVariants({ variant: "default" }),
              "h-14 text-lg rounded-2xl bg-white text-primary hover:bg-white/90 font-medium tracking-[-0.01em]",
            )}
            onClick={() => {
              buttonClick("send_signal_locked", "시그널 보내기");
              setViewGuardOpen(true);
            }}
          >
            시그널 보내기
          </Button>
        )}
        <div className="flex justify-center items-center gap-2">
          <Link
            to="/terms"
            className="text-center underline text-xs text-primary"
          >
            이용약관
          </Link>
          <span className=" text-xs">·</span>
          <Link
            to="/privacy"
            className="text-center underline text-xs text-primary"
          >
            개인정보처리방침
          </Link>
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

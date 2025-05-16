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
} from "@/env";

interface MainContentProps {
  profileRegistered: boolean;
  verifyNeeded: boolean;
}

const MainContent = ({ profileRegistered, verifyNeeded }: MainContentProps) => {
  const { data } = useCountProfile();
  const count = React.useMemo(() => data?.count ?? 0, [data?.count]);
  const [registerGuardOpen, setRegisterGuardOpen] = useState(false);
  const [viewGuardOpen, setViewGuardOpen] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center flex-1 p-6 grow">
      <div className="flex flex-col items-center justify-center gap-4 w-full grow">
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-3xl font-semibold text-center leading-tight tracking-tight text-black-700">
            당신의 시그널을
            <br />
            기다리고 있어요
          </h1>
          <p className="text-lg font-semibold text-black-600 tracking-tight">
            <span className="text-primary">{count}명</span>이 기다리고 있어요
          </p>
        </div>

        <div className="w-full max-w-[280px]">
          <img src={main} alt="Cat Character" className="w-full h-auto" />
        </div>
      </div>

      <div className="flex flex-col items-stretch gap-4 w-full">
        {ENABLE_REGISTER ? (
          <Link
            to="/profile/register"
            className={cn(
              buttonVariants({ variant: "secondary" }),
              "h-14 text-xl rounded-2xl text-pink shadow-sm",
            )}
          >
            {profileRegistered ? "내 프로필 보기" : "프로필 등록하기"}
          </Link>
        ) : (
          <Button
            variant="secondary"
            className={cn(
              buttonVariants({ variant: "secondary" }),
              "h-14 text-xl rounded-2xl text-pink shadow-sm",
            )}
            onClick={() => setRegisterGuardOpen(true)}
          >
            프로필 등록하기
          </Button>
        )}

        {ENABLE_PROFILE_VIEW ? (
          <Link
            to={verifyNeeded ? "/verify" : "/profile"}
            className={cn(
              buttonVariants({ variant: "default" }),
              "h-14 text-xl rounded-2xl bg-white text-pink hover:bg-white/90",
            )}
          >
            시그널 보내기
          </Link>
        ) : (
          <Button
            variant="default"
            className={cn(
              buttonVariants({ variant: "default" }),
              "h-14 text-xl rounded-2xl bg-white text-pink hover:bg-white/90",
            )}
            onClick={() => setViewGuardOpen(true)}
          >
            시그널 보내기
          </Button>
        )}
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

import React from "react";
import { buttonVariants } from "@/components/ui/button";
import { Link } from "react-router";
import main from "@/assets/home/main.png";
import { useCountProfile } from "@/hooks/queries/profiles";
import { cn } from "@/lib/utils";

interface MainContentProps {
  profileRegistered: boolean;
  verifyNeeded: boolean;
}

const MainContent = ({ profileRegistered, verifyNeeded }: MainContentProps) => {
  const { data } = useCountProfile();
  const count = React.useMemo(() => data?.count ?? 0, [data?.count]);

  return (
    <div className="flex flex-col items-center gap-16 justify-center flex-1 p-6 grow">
      <div className="flex flex-col items-center justify-center gap-4 w-full max-w-[342px] grow">
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

      <div className="flex flex-col items-stretch gap-4 w-full max-w-[342px]">
        <Link
          to="/profile/register"
          className={cn(
            buttonVariants({ variant: "secondary" }),
            "h-14 text-xl rounded-2xl bg-light-pink text-pink hover:bg-light-pink/90 shadow-sm",
            profileRegistered &&
              "pointer-events-none opacity-50 cursor-not-allowed",
          )}
          aria-disabled={profileRegistered}
        >
          {profileRegistered ? "프로필을 이미 등록했어요" : "프로필 등록하기"}
        </Link>

        <Link
          to={verifyNeeded ? "/verify" : "/profile"}
          className={cn(
            buttonVariants({ variant: "default" }),
            "h-14 text-xl rounded-2xl bg-white text-pink hover:bg-white/90",
          )}
        >
          시그널 보내기
        </Link>
      </div>
    </div>
  );
};

export default MainContent;

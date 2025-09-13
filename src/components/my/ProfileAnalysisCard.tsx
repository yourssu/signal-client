import { Button } from "@/components/ui/button";
import card from "@/assets/images/card.png";
import loginHeart from "@/assets/my/login_heart.svg";
import registerCard from "@/assets/my/register_card.svg";
import { Link } from "react-router";
import { LoginDrawer } from "@/components/LoginDrawer";

export interface ProfileAnalysisCardProps {
  isLoggedIn?: boolean;
  isProfileRegistered?: boolean;
}

type ViewStatus = "need-register" | "need-login" | "ready";

const ProfileAnalysisHeader = ({ viewStatus }: { viewStatus: ViewStatus }) => {
  switch (viewStatus) {
    case "need-register": {
      return (
        <>
          <h2 className="text-lg font-semibold text-center leading-tight">
            등록된 프로필이 없어요!
          </h2>
          <p className="text-sm font-medium text-gray-600 text-center">
            등록만 해도 새로운 인연을 만날 수 있어요
          </p>
        </>
      );
    }
    case "need-login": {
      return (
        <>
          <h2 className="text-lg font-semibold text-center leading-tight">
            로그인 아직 안 하셨나요?
          </h2>
          <p className="text-sm font-medium text-gray-600 text-center">
            내 프로필을 몇 명이 열람했는지 볼 수 있어요
          </p>
        </>
      );
    }
    case "ready": {
      return (
        <>
          <h2 className="text-lg font-semibold text-center leading-tight">
            <span className="text-neutral-700">내 프로필, </span>
            <span className="text-primary">몇 명</span>
            <span className="text-neutral-700">이나 봤을까?</span>
          </h2>
          <p className="text-sm font-medium text-gray-600 text-center">
            아래 버튼을 눌러 확인해보세요
          </p>
        </>
      );
    }
  }
};

const ProfileAnalysisButton = ({
  isLoggedIn,
  viewStatus,
}: {
  isLoggedIn: boolean;
  viewStatus: ViewStatus;
}) => {
  switch (viewStatus) {
    case "need-register":
      return (
        <div className="flex flex-col gap-3">
          <Button size="xl" className="font-semibold text-sm" asChild>
            <Link to="/my/profile">프로필 등록하기</Link>
          </Button>
          {!isLoggedIn && (
            <div className="flex gap-1 items-center justify-center text-center text-xs">
              <p className="text-center">이미 가입하셨다면?</p>
              <LoginDrawer>
                <button className="underline text-primary cursor-pointer">
                  로그인하기
                </button>
              </LoginDrawer>
            </div>
          )}
        </div>
      );
    case "need-login":
      return (
        <LoginDrawer>
          <Button size="xl" className="font-semibold text-sm">
            로그인하기
          </Button>
        </LoginDrawer>
      );
    case "ready":
      return (
        <Button
          size="xl"
          className="w-full bg-primary text-white hover:bg-primary/90 rounded-2xl font-semibold text-sm tracking-tight mt-5"
          asChild
        >
          <Link to="/my/analysis">내 프로필 상위 몇 %인지 알아보기</Link>
        </Button>
      );
  }
};

const ProfileAnalysisImage = ({ viewStatus }: { viewStatus: ViewStatus }) => {
  switch (viewStatus) {
    case "ready":
      return (
        <div className="overflow-hidden relative h-[190px] w-full flex items-center justify-center">
          <div className="absolute top-1/2 left-1/2 w-24 -translate-x-18 opacity-50">
            <img src={card} className="-translate-x-1/2 -translate-y-1/2" />
          </div>
          <div className="absolute top-1/2 left-1/2 w-24 translate-x-18 opacity-50">
            <img src={card} className="-translate-x-1/2 -translate-y-1/2" />
          </div>
          <div className="absolute top-1/2 left-1/2 w-32">
            <img
              src={card}
              className="-translate-x-1/2 -translate-y-1/2 rounded-2xl shadow-xl shadow-white-pink"
            />
          </div>
        </div>
      );
    case "need-login":
      return (
        <div className="relative h-[190px] w-full flex items-center justify-center">
          <img src={loginHeart} />
        </div>
      );
    case "need-register":
      return (
        <div className="relative h-[190px] w-full flex items-center justify-center">
          <img src={registerCard} />
        </div>
      );
  }
};

export const ProfileAnalysisCard = ({
  isLoggedIn,
  isProfileRegistered,
}: ProfileAnalysisCardProps) => {
  const viewStatus: ViewStatus = !isProfileRegistered
    ? "need-register"
    : !isLoggedIn
      ? "need-login"
      : "ready";
  return (
    <div className="bg-[#FFF2F7] rounded-[32px] p-8 w-full shadow-sm flex flex-col">
      <div className="flex flex-col items-center gap-5">
        {/* Title and Description */}
        <div className="flex flex-col items-center gap-1.5">
          <ProfileAnalysisHeader viewStatus={viewStatus} />
        </div>

        {/* Card Images */}
        <ProfileAnalysisImage viewStatus={viewStatus} />
      </div>

      {/* Analysis Button */}
      <ProfileAnalysisButton
        isLoggedIn={isLoggedIn ?? false}
        viewStatus={viewStatus}
      />
    </div>
  );
};

import archiveIcon from "@/assets/icons/archive_icon.svg";
import registerCharacter from "@/assets/my/register_character.png";
import { Link } from "react-router";
import { LoginDrawer } from "@/components/LoginDrawer";
import { Button } from "@/components/ui/button";
import { ChevronRight, Users } from "lucide-react";
import { mypageRegisterClick, mypageAccountConnectClick } from "@/lib/analytics";

export interface ProfileAnalysisCardProps {
  isLoggedIn?: boolean;
  isProfileRegistered?: boolean;
}

export const ProfileAnalysisCard = ({
  isLoggedIn,
  isProfileRegistered,
}: ProfileAnalysisCardProps) => {
  if (!isProfileRegistered) {
    return (
      <div className="bg-white rounded-[20px] px-4 pt-8 pb-5 w-full flex flex-col items-center justify-between gap-0">
        <div className="flex flex-col gap-1 text-center">
          <p className="h3 text-label-normal">시그널 프로필이 없어요</p>
          <p className="caption1 text-label-alternative">
            새학기 첫 축제, 운명의 상대를 만날 기회
          </p>
        </div>
        <img src={registerCharacter} alt="" className="size-40 object-contain my-6" />
        <div className="flex flex-col gap-3 items-center w-full">
          <Button
            variant="default"
            className="button-l rounded-2xl h-[50px] w-full"
            asChild
            onClick={() => mypageRegisterClick("no_profile_card")}
          >
            <Link to="/my/profile">프로필 등록하기</Link>
          </Button>
          {!isLoggedIn && (
            <div className="flex gap-1 caption1 text-label-alternative">
              <p>이미 프로필이 있다면?</p>
              <LoginDrawer>
                <button
                  className="text-primary underline cursor-pointer"
                  onClick={() => mypageAccountConnectClick()}
                >
                  구글 계정 연동
                </button>
              </LoginDrawer>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <LoginDrawer>
        <div className="bg-white rounded-[20px] px-4 py-5 w-full flex items-center gap-2.5 cursor-pointer">
          <div className="bg-fill-pink rounded-[10px] size-9 flex items-center justify-center shrink-0">
            <img src={archiveIcon} alt="" className="size-[23px]" />
          </div>
          <div className="flex-1 flex flex-col gap-1 min-w-0">
            <div className="flex items-center">
              <p className="h4 text-label-normal whitespace-nowrap">
                로그인 하러 가기
              </p>
              <ChevronRight className="size-5 text-label-normal" />
            </div>
            <p className="caption1 text-label-alternative whitespace-nowrap">
              내 프로필이 열람된 횟수를 확인할 수 있어요
            </p>
          </div>
        </div>
      </LoginDrawer>
    );
  }

  return (
    <Link
      to="/my/analysis"
      className="bg-white rounded-[20px] px-4 py-5 w-full flex items-center gap-2.5 cursor-pointer"
    >
      <div className="bg-fill-pink rounded-[10px] size-9 flex items-center justify-center shrink-0">
        <Users className="size-[23px] text-primary" />
      </div>
      <div className="flex-1 flex flex-col gap-1 min-w-0">
        <div className="flex items-center">
          <p className="h4 text-label-normal whitespace-nowrap">
            내 프로필 상위 % 확인하기
          </p>
          <ChevronRight className="size-5 text-label-normal" />
        </div>
        <p className="caption1 text-label-alternative whitespace-nowrap">
          프로필, 몇 명이나 봤을까?
        </p>
      </div>
    </Link>
  );
};

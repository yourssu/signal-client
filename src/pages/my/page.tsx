import React from "react";
import { Link } from "react-router";
import TopBar from "@/components/Header";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import ticketIcon from "@/assets/icons/ticket_icon.svg";
import userIcon from "@/assets/icons/user_icon.svg";
import archiveIcon from "@/assets/icons/archive_icon.svg";
import { ProfileAnalysisCard } from "@/components/my/ProfileAnalysisCard";
import { useViewerSelf } from "@/hooks/queries/viewers";
import { userProfileAtom } from "@/atoms/userProfile";
import { useAtom } from "jotai";

const MyPage: React.FC = () => {
  const { data: self } = useViewerSelf();
  const ticketCount = (self?.ticket ?? 0) - (self?.usedTicket ?? 0);
  const [profile] = useAtom(userProfileAtom);

  return (
    <div className="w-full h-full flex flex-col items-center">
      <TopBar onBack="/" hideInfo />
      <div className="flex flex-col gap-4 items-center w-full max-w-md grow p-6">
        <div className="flex flex-col items-start w-full">
          <h1 className="text-2xl font-semibold text-stone-700">마이페이지</h1>
        </div>

        {/* Ticket Info Card */}
        <div className="bg-white rounded-3xl p-6 w-full flex items-end justify-between shadow-sm">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1 px-0.5">
              <p className="text-[10px] text-gray-500 font-medium">
                현재 이용권 보유
              </p>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-5 h-5 flex items-center justify-center">
                <img src={ticketIcon} alt="티켓" className="w-4 h-4" />
              </div>
              <p className="text-base font-semibold text-neutral-700">
                {ticketCount}장
              </p>
            </div>
          </div>
          <Button
            size="sm"
            className="bg-[#FFF2F7] text-primary hover:bg-[#FFF2F7]/80 text-xs font-semibold px-4 py-2 h-9 rounded-xl"
            asChild
          >
            <Link to="/purchase">충전</Link>
          </Button>
        </div>

        {/* Profile Analysis Card */}
        <ProfileAnalysisCard isProfileRegistered={!!profile} />

        {/* Menu Options */}
        <div className="bg-white rounded-3xl overflow-hidden w-full">
          <div className="flex flex-col">
            {profile && (
              <Link
                to="/my/profile"
                className="flex items-center justify-between w-full p-4 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <div className="bg-[#FFF2F7] rounded-lg w-6 h-6 flex items-center justify-center">
                    <img src={userIcon} alt="프로필" className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-sm font-semibold text-neutral-700 tracking-tight">
                    내 프로필 보기
                  </span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </Link>
            )}
            {self?.purchasedProfiles.length && (
              <Link
                to="/my/signals"
                className="flex items-center justify-between w-full p-4 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <div className="bg-[#FFF2F7] rounded-lg w-6 h-6 flex items-center justify-center">
                    <img
                      src={archiveIcon}
                      alt="구매 목록"
                      className="w-3.5 h-3.5"
                    />
                  </div>
                  <span className="text-sm font-semibold text-neutral-700 tracking-tight">
                    구매한 프로필 목록
                  </span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPage;

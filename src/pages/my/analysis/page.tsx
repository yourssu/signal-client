import { userProfileAtom } from "@/atoms/userProfile";
import TopBar from "@/components/Header";
import heartIcon from "@/assets/icons/heart_icon.svg";
import { Button } from "@/components/ui/button";
import { useAtomValue } from "jotai";
import { Navigate } from "react-router";
import ProfileAnalysisResult from "@/components/my/ProfileAnalysisResult";
import { useProfileRanking } from "@/hooks/queries/profiles";
import { useUserInfo } from "@/hooks/queries/users";
import { providerAtom } from "@/atoms/authTokens";
import { IS_LOCAL } from "@/env";
import { toast } from "sonner";
import { shareProfileAnalysis } from "@/lib/profileAnalysis";
import { useState } from "react";

const AnalysisMyProfilePage: React.FC = () => {
  const profile = useAtomValue(userProfileAtom);
  const authProvider = useAtomValue(providerAtom);
  const [isSharing, setIsSharing] = useState(false);

  // 사용자 정보 가져오기 (UUID 필요)
  const { data: userInfo } = useUserInfo();

  // 프로필 랭킹 정보 가져오기 (UUID가 있을 때만)
  const { data: profileRankingData } = useProfileRanking(userInfo?.uuid || "", {
    enabled: !!userInfo?.uuid,
  });

  const totalProfiles = profileRankingData?.totalProfiles ?? 1;
  const profileViewers = profileRankingData?.purchaseCount ?? 0;
  const profileRank = profileRankingData?.rank ?? totalProfiles;
  const profilePercentage =
    Math.floor((profileRank / totalProfiles) * 1000) / 10;

  if (!profile || profile === null)
    return <Navigate to="/profile/register" replace />;

  if (authProvider === "local" && !IS_LOCAL)
    return <Navigate to="/my" replace />;

  const handleShare = async () => {
    setIsSharing(true);
    await shareProfileAnalysis(
      totalProfiles,
      profileViewers,
      profilePercentage,
    ).catch((error) => {
      if (error instanceof Error && error.name === "AbortError") {
        toast.error("공유가 취소되었어요.");
        return;
      } else {
        toast.error("공유 중 오류가 발생했어요.");
        console.error("Error sharing profile analysis:", error);
      }
    });
    setIsSharing(false);
  };

  return (
    <div className="min-h-dvh flex flex-col items-center">
      <TopBar onBack="/my" />
      <div className="w-full max-w-md grow p-6 flex flex-col gap-10">
        <div className="w-full max-w-md mx-auto flex flex-col pt-2 gap-2 grow">
          <h1 className="text-2xl font-semibold text-stone-700 self-center text-center">
            지금까지 <span className="text-primary">{profileViewers}명</span>이
            <br />
            프로필을 열람했어요
          </h1>
          <div className="bg-white rounded-[18px] p-4 w-full flex gap-3 items-start">
            <div className="flex items-center justify-center p-2 bg-[#FFC9DE] rounded-xl self-stretch aspect-square">
              <img src={heartIcon} alt="하트" className="size-5" />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-xs text-neutral-500 font-medium">
                등록된 {totalProfiles}개의 프로필 중
              </p>
              <p className="text-sm font-semibold text-neutral-700">
                <span className="text-primary">상위 {profilePercentage}%</span>{" "}
                프로필이에요
              </p>
            </div>
          </div>
          <div className="grow flex flex-col justify-center items-stretch self-stretch">
            <ProfileAnalysisResult
              count={profileViewers}
              percentage={profilePercentage}
            />
          </div>
          <div className="flex gap-4 w-full relative z-50">
            <Button
              size="xl"
              className="grow rounded-2xl"
              disabled={!profile || isSharing}
              onClick={handleShare}
            >
              스크린샷 저장 후 자랑하기
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisMyProfilePage;

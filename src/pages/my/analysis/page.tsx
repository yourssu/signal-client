import { userProfileAtom } from "@/atoms/userProfile";
import TopBar from "@/components/Header";
import heartIcon from "@/assets/icons/heart_icon.svg";
import { Button } from "@/components/ui/button";
import { useAtom } from "jotai";
import { Navigate } from "react-router";
import ProfileAnalysisResult from "@/components/my/ProfileAnalysisResult";
import { useCountProfile, useProfileRanking } from "@/hooks/queries/profiles";
import { useUserInfo } from "@/hooks/queries/users";

const AnalysisMyProfilePage: React.FC = () => {
  const [profile] = useAtom(userProfileAtom);

  // 사용자 정보 가져오기 (UUID 필요)
  const { data: userInfo } = useUserInfo();

  // 전체 프로필 수 가져오기
  const { data: profileCountData } = useCountProfile();

  // 프로필 랭킹 정보 가져오기 (UUID가 있을 때만)
  const { data: profileRankingData } = useProfileRanking(userInfo?.uuid || "", {
    enabled: !!userInfo?.uuid,
  });

  const profileCount = profileCountData?.count ?? 0;
  const profileViewers = profileRankingData?.purchaseCount ?? 0;
  const profilePercentage = profileRankingData?.rank ?? 100;

  if (!profile || profile === null) return <Navigate to="/profile/register" />;

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
          <div className="bg-white rounded-3xl p-6 w-full flex gap-3 items-start shadow-sm">
            <div className="flex items-center justify-center p-2 bg-[#FFC9DE] rounded-xl self-stretch aspect-square">
              <img src={heartIcon} alt="하트" className="size-5" />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-xs text-neutral-500 font-medium">
                등록된 {profileCount}개의 프로필 중
              </p>
              <p className="text-sm font-semibold text-neutral-700">
                <span className="text-primary">상위 {profilePercentage}%</span>{" "}
                프로필이에요
              </p>
            </div>
          </div>
          <div className="grow flex flex-col justify-center items-stretch self-stretch">
            <ProfileAnalysisResult />
          </div>
          <div className="flex gap-4 w-full relative z-50">
            <Button
              variant="secondary"
              size="xl"
              className="basis-1/3 rounded-3xl text-primary"
            >
              저장
            </Button>

            <Button size="xl" className="grow rounded-3xl" disabled={!profile}>
              공유하기
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisMyProfilePage;

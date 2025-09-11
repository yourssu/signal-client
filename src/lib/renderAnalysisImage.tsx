import satori from "satori/wasm";
import heartIcon from "@/assets/icons/heart_icon.svg";
import ProfileAnalysisResult from "@/components/my/ProfileAnalysisResult";

export const renderAnalysisSvg = async (
  profileCount: number,
  profileViewers: number,
  profilePercentage: number,
): Promise<string> => {
  return await satori(
    <div className="bg-background size-full grow p-6 flex flex-col gap-10">
      <div className="w-full mx-auto flex flex-col pt-2 gap-2 grow">
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
              등록된 {profileCount}개의 프로필 중
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
      </div>
    </div>,
    {
      width: 1080,
      height: 1920,
      fonts: [
        {
          name: "Pretendard",
          data: await fetch("/fonts/PretendardVariable.subset.woff").then(
            (res) => res.arrayBuffer(),
          ),
          weight: 400,
          style: "normal",
        },
      ],
      pointScaleFactor: 3,
      debug: true,
    },
  );
};

import { PROFILE_ANALYSIS_WRITINGS } from "@/env";
import { renderAnalysisSvg } from "./renderAnalysisImage";

export const selectWriting = (
  _count: number,
  percentage: number,
): [string, string] => {
  const rand = Math.floor(Math.random() * 100);
  if (percentage >= 70)
    return PROFILE_ANALYSIS_WRITINGS["70"][
      rand % PROFILE_ANALYSIS_WRITINGS["70"].length
    ] as [string, string];
  if (percentage >= 30)
    return PROFILE_ANALYSIS_WRITINGS["30"][
      rand % PROFILE_ANALYSIS_WRITINGS["30"].length
    ] as [string, string];
  if (percentage >= 10)
    return PROFILE_ANALYSIS_WRITINGS["10"][
      rand % PROFILE_ANALYSIS_WRITINGS["10"].length
    ] as [string, string];
  if (percentage >= 5)
    return PROFILE_ANALYSIS_WRITINGS["5"][
      rand % PROFILE_ANALYSIS_WRITINGS["5"].length
    ] as [string, string];
  return PROFILE_ANALYSIS_WRITINGS["1"][
    rand % PROFILE_ANALYSIS_WRITINGS["1"].length
  ] as [string, string];
};

export const shareProfileAnalysis = async (
  profileCount: number,
  profileViewers: number,
  profilePercentage: number,
) => {
  const data = await getProfileAnalysisShareData(
    profileCount,
    profileViewers,
    profilePercentage,
  );
  if (typeof navigator.canShare !== "function" || !navigator.canShare(data)) {
    throw new Error("이 브라우저에서는 공유할 수 없습니다.");
  }
  await navigator.share(data);
};

export const getProfileAnalysisShareData = async (
  profileCount: number,
  profileViewers: number,
  profilePercentage: number,
) => {
  // SVG 텍스트 생성
  const svgText = await renderAnalysisSvg(
    profileCount,
    profileViewers,
    profilePercentage,
  );

  // SVG를 File 객체로 변환
  const svgBlob = new Blob([svgText], { type: "image/svg+xml" });
  const svgFile = new File([svgBlob], "profile-analysis.svg", {
    type: "image/svg+xml",
  });

  return {
    title: `${selectWriting(profileCount, profilePercentage)[1]} - 시그널`,
    text: `지금까지 ${profileViewers}명이 내 프로필을 열람했어요!\n지금 시그널에서 내 프로필을 등록해보세요!`,
    url: window.location.origin,
    files: [svgFile],
  };
};

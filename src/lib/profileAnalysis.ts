import { PROFILE_ANALYSIS_WRITINGS } from "@/env";
import { renderAnalysisPng } from "./renderAnalysisImage";
import p1 from "@/assets/my/analysis/p1.png";
import p5 from "@/assets/my/analysis/p5.png";
import p10 from "@/assets/my/analysis/p10.png";
import p30 from "@/assets/my/analysis/p30.png";
import p70 from "@/assets/my/analysis/p70.png";
import p100 from "@/assets/my/analysis/p100.png";

export const selectImage = (count: number, percentage: number) => {
  if (count === 0) return p100;
  if (percentage >= 70) return p70;
  if (percentage >= 30) return p30;
  if (percentage >= 10) return p10;
  if (percentage >= 5) return p5;
  return p1;
};

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
  // PNG 생성
  const pngBuffer = await renderAnalysisPng(
    profileCount,
    profileViewers,
    profilePercentage,
  );

  // SVG를 File 객체로 변환
  const pngBlob = new Blob([pngBuffer.buffer as ArrayBuffer], {
    type: "image/png",
  });
  const pngFile = new File([pngBlob], "profile-analysis.png", {
    type: "image/png",
  });

  return {
    title: `${selectWriting(profileCount, profilePercentage)[1]} - 시그널`,
    text: `지금까지 ${profileViewers}명이 내 프로필을 열람했어요!\n지금 시그널에서 내 프로필을 등록해보세요!`,
    url: window.location.origin,
    files: [pngFile],
  };
};

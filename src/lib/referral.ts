const REFERRAL_TITLE = "모두의 시그널 - by YOURSSU";

export type ReferralShareResult = "shared" | "copied" | "cancelled";

/** 도메인을 박지 않는다. dev·스테이징·운영마다 origin이 다르다. */
export const getReferralShareData = () => ({
  title: REFERRAL_TITLE,
  // iOS는 title을 무시하고 text만 쓰는 경우가 많아 같은 문구를 둘 다 넣는다.
  text: REFERRAL_TITLE,
  url: `${window.location.origin}/?utm_source=referral`,
});

/**
 * 공유 시트를 띄운다. 시트가 없는 브라우저(데스크톱 Firefox 등)에서는 링크를 복사한다.
 * 사용자가 시트를 닫은 것(AbortError)은 실패가 아니므로 cancelled로 돌려준다.
 * 그 밖의 실패는 그대로 던진다.
 */
export const shareReferralLink = async (): Promise<ReferralShareResult> => {
  const data = getReferralShareData();
  if (typeof navigator.share !== "function") {
    await navigator.clipboard.writeText(data.url);
    return "copied";
  }
  try {
    await navigator.share(data);
    return "shared";
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError")
      return "cancelled";
    throw error;
  }
};

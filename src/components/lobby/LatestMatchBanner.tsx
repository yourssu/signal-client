import { useEffect, useState } from "react";
import megaphone from "@/assets/lobby/megaphone.svg";
import type { MeetingLatestMatchResponse } from "@/types/meeting";

interface LatestMatchBannerProps {
  match: MeetingLatestMatchResponse;
}

const remainingMs = (visibleUntil: string) =>
  new Date(visibleUntil).getTime() - Date.now();

export default function LatestMatchBanner({ match }: LatestMatchBannerProps) {
  // 매칭된 순간부터 30초만 띄운다. 폴링(5초)에만 맡기면 그만큼 늦게 사라진다.
  const [isVisible, setIsVisible] = useState(
    () => remainingMs(match.visibleUntil) > 0,
  );

  useEffect(() => {
    const remaining = remainingMs(match.visibleUntil);
    if (!Number.isFinite(remaining) || remaining <= 0) {
      setIsVisible(false);
      return;
    }

    setIsVisible(true);
    const timer = window.setTimeout(() => setIsVisible(false), remaining);
    return () => clearTimeout(timer);
  }, [match.visibleUntil]);

  if (!isVisible) return null;

  return (
    <div className="flex w-full items-center gap-[10px] rounded-xl bg-white px-3 py-4 drop-shadow-[1px_1px_2px_rgba(0,0,0,0.16)]">
      <img src={megaphone} alt="" className="h-[15.34px] w-4" />
      <span className="caption1 text-label-alternative">
        지금 [{match.creatorNickname}]님 미팅이 매칭 됐어요
      </span>
    </div>
  );
}

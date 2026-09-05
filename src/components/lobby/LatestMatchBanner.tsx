import megaphone from "@/assets/lobby/megaphone.svg";
import type { MeetingLatestMatchResponse } from "@/types/meeting";

interface LatestMatchBannerProps {
  match: MeetingLatestMatchResponse;
}

export default function LatestMatchBanner({ match }: LatestMatchBannerProps) {
  return (
    <div className="flex w-full items-center gap-[10px] rounded-xl bg-white px-3 py-4 drop-shadow-[1px_1px_2px_rgba(0,0,0,0.16)]">
      <img src={megaphone} alt="" className="h-[15.34px] w-4" />
      <span className="caption1 text-label-alternative">
        지금 [{match.creatorNickname}]님 미팅이 매칭 됐어요
      </span>
    </div>
  );
}

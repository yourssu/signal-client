import ticket from "@/assets/lobby/ticket.svg";

interface MatchChanceChipProps {
  /** 오늘 남은 매칭 기회. 0이면 횟수 대신 모두 썼다고 알린다. */
  count: number;
}

export default function MatchChanceChip({ count }: MatchChanceChipProps) {
  return (
    <div className="flex items-center justify-center gap-1 rounded-[24px] bg-[rgba(0,0,0,0.3)] px-3 py-2">
      <img src={ticket} alt="" className="h-[10px] w-[14px]" />
      <span className="caption1 text-static-white">매칭 기회</span>
      <span className="caption1 text-static-white whitespace-nowrap">
        {count > 0 ? `${count}회` : "모두 소진"}
      </span>
    </div>
  );
}
